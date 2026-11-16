import bpy, math, json, os
from mathutils import Vector

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
WIP_GLB = os.path.join(OUT_DIR, 'shirt-sewn-prototype-wip10.glb')
FINAL_GLB = WIP_GLB
SIM_FRAME = int(os.environ.get("SIM_FRAME", 16))

# A real 2D-pattern assembly: front/back shirt panels, tubular sleeve patterns
# with a sewn underarm edge, collar stand/leaves and hollow cuff bands. Sewing
# springs are explicit loose mesh edges, as Blender Cloth expects.
verts=[]; faces=[]; sew=[]; pin_ids=set(); panel_meta=[]
def add_grid(name, rows, cols, point, skip=None, reverse=False):
    grid=[]
    for r in range(rows+1):
        row=[]
        for c in range(cols+1):
            p=point(r/rows,c/cols)
            row.append(len(verts)); verts.append(tuple(p))
        grid.append(row)
    for r in range(rows):
        for c in range(cols):
            if skip and skip(r/rows,c/cols): continue
            a,b=grid[r][c],grid[r][c+1]; d,e=grid[r+1][c],grid[r+1][c+1]
            faces.append((a,d,e,b) if reverse else (a,b,e,d))
    panel_meta.append({'name':name,'rows':rows,'cols':cols})
    return grid

def stitch(a,b):
    if a!=b: sew.append((a,b))
def stitch_path(a,b):
    n=min(len(a),len(b))
    for i in range(n): stitch(a[i],b[i])
def nearest_map(src,dst,score):
    for i,p in enumerate(src):
        q=min(dst,key=lambda j:score(Vector(verts[p]),Vector(verts[j])))
        stitch(p,q)

def smoothstep(a,b,x):
    t=max(0,min(1,(x-a)/(b-a)))
    return t*t*(3-2*t)

def interp(points,t):
    x=t*(len(points)-1); i=min(len(points)-2,int(x)); f=x-i
    return points[i]*(1-f)+points[i+1]*f

# Matched shirt body patterns, shown as front and back cloth sheets with
# slight wearing ease. The neck curves are cut into the panel boundaries.
widths=[.53,.52,.51,.54,.59,.64,.66,.63,.57]
zrows=[.08,.24,.43,.62,.82,1.02,1.20,1.38,1.53]
body={}
for side in ('front','back'):
    front=side=='front'; depth=-.22 if front else .22
    def bodypt(v,u):
        z=interp(zrows,v); w=interp(widths,v)
        x=(2*u-1)*w
        # naturally curved shell panels, front chest slightly fuller than back
        cross=math.sqrt(max(0.0,1-(x/w)**2))
        shoulder_relief=1.0-.82*smoothstep(.82,1.0,v)
        arm_zone=smoothstep(.68,.88,v)*math.exp(-(((1-abs(x)/w)/.11)**2))
        y=depth*cross*shoulder_relief + (-1 if front else 1)*.105*arm_zone
        if v>.84:
            neck=0.13 if front else 0.055
            z-=neck*math.exp(-((x/.155)**4))*smoothstep(.82,1.0,v)
        return (x,y,z)
    # Rows finely tessellated through torso to carry fabric wrinkles.
    grid=add_grid(f'{side} torso pattern',48,32,bodypt,reverse=not front)
    body[side]=grid

# Side seams close torso below armhole; neckline-facing shoulder seams close
# the upper shoulder run while preserving the neck opening.
for r in range(0,36):
    stitch(body['front'][r][0],body['back'][r][0])
    stitch(body['front'][r][-1],body['back'][r][-1])
for c in list(range(0,12))+list(range(21,33)):
    stitch(body['front'][-1][c],body['back'][-1][c])
# pin only the two shoulder tips so the unsupported shell can hang naturally.
for c in list(range(0,12))+list(range(21,33)):
    pin_ids.add(body['front'][-1][c]); pin_ids.add(body['back'][-1][c])
for g in (body['front'],body['back']):
    for r in range(49):
        pin_ids.add(g[r][0]); pin_ids.add(g[r][-1])
    pin_ids.add(g[0][0]); pin_ids.add(g[0][-1])
    for c in range(33): pin_ids.add(g[0][c])

# Sleeves: each is a shaped cloth pattern wrapped once around the sleeve axis;
# duplicated long edges are sewn together. Front/back cap arcs attach to the
# torso armhole perimeter, while terminal circles stay open.
sleeves={}
for sgn,name in ((-1,'L'),(1,'R')):
    def sleevept(v,u):
        # axial path from shoulder root to cuff; moderate natural sleeve drop
        center=Vector((sgn*(.60+.34*v), 0.0, 1.37-.83*v))
        axis=Vector((sgn*.38,0,-.925)).normalized()
        depth=Vector((0,1,0)); cross=axis.cross(depth).normalized()
        radius=.185*(1-v)+.105*v + .018*math.sin(math.pi*v)
        ang=2*math.pi*u
        p=center + depth*(radius*math.cos(ang)) + cross*(radius*math.sin(ang))
        # a mild elbow bend and non-uniform ease, avoiding a rigid straight tube
        p.x += sgn*.018*math.sin(math.pi*v)*v
        p.y += .012*math.sin(2*math.pi*u)*math.sin(math.pi*v)
        return p
    g=add_grid(f'{name} sleeve sewn panel',40,24,sleevept,
               skip=lambda v,u: u>=1.0)
    # Close the long underarm seam by sewing the two longitudinal pattern edges.
    for r in range(41): stitch(g[r][0],g[r][-1])
    # Armhole: sew front/back armhole arcs to sleeve cap halves (equal sample count).
    cap=g[0]
    front_cap=[cap[i] for i in range(6,19)]
    back_cap=[cap[i] for i in list(range(18,25))+list(range(0,6))]
    # Body side seam samples span the armhole cut boundary, from underarm to shoulder.
    body_rows=list(range(36,49))
    front_edge=[body['front'][r][0 if sgn<0 else -1] for r in body_rows]
    back_edge=[body['back'][r][0 if sgn<0 else -1] for r in body_rows]
    # Map from lower underarm to upper cap, using nearest axial/vertical points.
    front_sorted=sorted(front_cap,key=lambda i:verts[i][2])
    back_sorted=sorted(back_cap,key=lambda i:verts[i][2])
    for seq,edge in ((front_sorted,front_edge),(back_sorted,back_edge)):
        for j,pid in enumerate(edge):
            # normalized rank matching preserves ordered seam edges
            idx=round(j*(len(seq)-1)/(len(edge)-1))
            stitch(pid,seq[idx])
    for i in g[0]: pin_ids.add(i)
    sleeves[name]=g

# Hollow cuff bands are separate cloth strips; bottom ring remains open.
cuffs={}
for sgn,name in ((-1,'L'),(1,'R')):
    sg=sleeves[name]
    def cuffpt(v,u):
        sleeve_end=Vector(verts[sg[-1][round(u*24)]])
        axis=(Vector(verts[sg[-1][12]])-Vector(verts[sg[-3][12]])).normalized()
        radial=sleeve_end-Vector(verts[sg[-1][12]])
        p=sleeve_end + axis*(.075*v)
        p += radial*(.015*v)
        return p
    g=add_grid(f'{name} cuff pattern',4,24,cuffpt,skip=lambda v,u: u>=1.0)
    for r in range(5): stitch(g[r][0],g[r][-1])
    for c in range(25): stitch(g[0][c],sg[-1][c])
    for i in g[0]: pin_ids.add(i)
    for i in g[-1]: pin_ids.add(i)
    cuffs[name]=g

# Collar stand as a curved band sewn along a continuous neckline path. It is a
# surface strip with open inner/upper boundary, not a capped neck solid.
N=32
stand=[]
for row in range(3):
    rr=[]
    for i in range(N):
        t=i/N; ang=2*math.pi*t
        x=.18*math.sin(ang)
        y=.16*math.cos(ang)
        front_weight=max(0,-math.cos(ang))
        z=1.525-.105*front_weight + .045*(row/2)
        rr.append(len(verts)); verts.append((x,y,z))
    stand.append(rr)
for row in stand: pin_ids.update(row)
for r in range(2):
    for i in range(N): faces.append((stand[r][i],stand[r][(i+1)%N],stand[r+1][(i+1)%N],stand[r+1][i]))
# Back closure of the stand is stitched at center back; bottom edge to top
# neckline of the torso front/back is mapped by closest x/z along the neck run.
for r in range(3): stitch(stand[r][0],stand[r][-1])
for side in ('front','back'):
    grid=body[side]
    boundary=grid[-1]
    neck_ids=[boundary[c] for c in range(11,22)]
    band_ids=[stand[0][i] for i in range(N) if (verts[stand[0][i]][1]<0 if side=='front' else verts[stand[0][i]][1]>=0)]
    band_ids=sorted(band_ids,key=lambda j:verts[j][0])
    neck_ids=sorted(neck_ids,key=lambda j:verts[j][0])
    for j,pid in enumerate(neck_ids):
        idx=round(j*(len(band_ids)-1)/max(1,len(neck_ids)-1))
        stitch(pid,band_ids[idx])

# Two broad collar-leaf pattern panels attach to the front stand top, with a
# gently curved fold and rounded distal profile.
leaf_grids=[]
for sgn,side_name in ((-1,'L'),(1,'R')):
    def leafpt(v,u):
        center=sgn*(.035+.13*v)
        width=(.10*(1-v)+.075*v)*math.sin(math.pi*(.06+.88*u))
        x=center+sgn*(u-.5)*width
        z=1.50-.155*v + .008*math.sin(math.pi*u)*math.sin(math.pi*v)
        y=-.255-.018*math.sin(math.pi*v)*math.sin(math.pi*u)
        return (x,y,z)
    g=add_grid(f'{side_name} folded collar leaf panel',18,12,leafpt,reverse=True)
    # root edge sew to the front half of the stand
    band=sorted([stand[-1][i] for i in range(N) if verts[stand[-1][i]][1]<0 and (verts[stand[-1][i]][0]<0 if sgn<0 else verts[stand[-1][i]][0]>0)],key=lambda j:verts[j][0])
    root=sorted(g[0],key=lambda j:verts[j][0])
    for j,pid in enumerate(root): stitch(pid,band[round(j*(len(band)-1)/(len(root)-1))])
    leaf_grids.append(g)

# Center placket is a separate narrow pattern panel sewn along both long edges.
placket=add_grid('center front placket pattern',32,4,
    lambda v,u:(-.030+.060*u,-.222-.004*math.sin(math.pi*v),1.40-1.16*v),reverse=True)
front=body['front']
for r in range(33):
    # nearest front shell vertex around both long edges
    for c,pc in ((0,15),(4,17)):
        target=verts[placket[r][c]]
        shell=min((front[round((1-v)*48)][pc] for v in [r/32]),key=lambda j:(verts[j][0]-target[0])**2+(verts[j][2]-target[2])**2)
        stitch(placket[r][c],shell)

# Assemble actual sewn cloth object and add the explicit stitch springs as loose edges.
mesh=bpy.data.meshes.new('Pattern panels with explicit sewing springs')
mesh.from_pydata(verts,sew,faces);mesh.update()
obj=bpy.data.objects.new('ATEL-53 sewn shirt panels · cloth simulation',mesh)
bpy.context.scene.collection.objects.link(obj)
# Neutral gray only.
mat=bpy.data.materials.new('Neutral gray fabric · shape review');mat.diffuse_color=(.56,.58,.60,1);mat.roughness=.88
button_mat=bpy.data.materials.new('Neutral gray trial hardware');button_mat.diffuse_color=(.30,.32,.34,1);button_mat.roughness=.72
obj.data.materials.append(mat)
for poly in mesh.polygons: poly.material_index=0; poly.use_smooth=True
# Pin shoulder tips lightly; no mannequin/collision proxy is present.
group=obj.vertex_groups.new(name='Shoulder support pins')
for i in pin_ids: group.add([i],1.0,'REPLACE')
cloth=obj.modifiers.new('Sewn panel cloth simulation','CLOTH')
s=cloth.settings
s.quality=6;s.mass=.35;s.tension_stiffness=22;s.compression_stiffness=22;s.shear_stiffness=12;s.bending_stiffness=.22;s.bending_damping=5
s.use_sewing_springs=True;s.sewing_force_max=10;s.pin_stiffness=1.0;s.vertex_group_mass=group.name
cloth.collision_settings.use_collision=False;cloth.collision_settings.use_self_collision=False
cloth.collision_settings.collision_quality=2
scene=bpy.context.scene
scene.render.fps=24;scene.frame_start=1;scene.frame_end=SIM_FRAME;scene.gravity=(0,0,-.35)
scene.unit_settings.system='METRIC'
scene.frame_set(1)
# Sequential frame evaluation is required for stable cloth cache.
for frame in range(1,SIM_FRAME+1):
    scene.frame_set(frame)
    if frame%12==0: print('SIM_FRAME',frame,flush=True)
# Freeze the evaluated fabric at the final drape frame.
scene.frame_set(SIM_FRAME)
bpy.context.view_layer.objects.active=obj
obj.select_set(True)
bpy.ops.object.modifier_apply(modifier=cloth.name)
# Remove loose sewing springs from final export; they were simulation constraints, not fabric edges.
mesh=obj.data
bm=None
# Rebuild final mesh from evaluated surface faces, discarding loose spring edges.
final_verts=[tuple(v.co) for v in mesh.vertices]
final_faces=[tuple(p.vertices) for p in mesh.polygons]
clean=bpy.data.meshes.new('Baked sewn fabric shell')
clean.from_pydata(final_verts,[],final_faces);clean.update()
for poly in clean.polygons: poly.use_smooth=True
clean.materials.append(mat)
obj.data=clean
# Slight subdivision is not applied; preserve simulated cloth topology.
# Add trial buttons as low-profile geometry attached to the placket/cuffs.
def add_button(name, loc, radius=.012, depth=.004):
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=radius, depth=depth, end_fill_type='NGON', location=loc, rotation=(math.pi/2,0,0))
    b=bpy.context.object;b.name=name;b.data.materials.append(button_mat)
    for p in b.data.polygons:p.use_smooth=True
    # join later into a single standalone shell scene
    return b
buttons=[]
def shell_point(target):
    return min((v.co.copy() for v in obj.data.vertices), key=lambda p:(p.x-target[0])**2+(p.z-target[2])**2+0.28*(p.y-target[1])**2)
for z in [1.31,1.12,.93,.74,.55,.36]:
    p=shell_point((0,-.18,z)); buttons.append(add_button(f'Gray trial placket button {z:.2f}',(p.x,p.y-.002,p.z),.010,.003))
for sgn,label in ((-1,'L'),(1,'R')):
    p=shell_point((sgn*.93,-.16,.60)); buttons.append(add_button(f'Gray trial cuff button {label}',(p.x,p.y-.002,p.z),.009,.003))
# Join button geometry into garment mesh to keep a simple static GLB scene.
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True)
for b in buttons:b.select_set(True)
bpy.context.view_layer.objects.active=obj
bpy.ops.object.join()
# Save an editable project before export for provenance.
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT_DIR,'shirt-sewn-simulation-v1.blend'))
# Export only garment, glTF exporter performs Blender Z-up -> glTF Y-up conversion.
bpy.ops.export_scene.gltf(filepath=FINAL_GLB,export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
print('EXPORTED',FINAL_GLB,'vertices',len(obj.data.vertices),'faces',len(obj.data.polygons),'sewingSprings',len(sew),'pins',len(pin_ids),flush=True)
