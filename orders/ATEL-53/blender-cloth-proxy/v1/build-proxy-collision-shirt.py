import bpy, math, os
from mathutils import Vector

BASE=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.join(BASE,'shirt-proxy-cloth-wip.glb')
FRAME_END=int(os.environ.get('SIM_FRAME','36'))
verts=[]; faces=[]; shared={}; meta={}; pins=set()

def add_v(co,key=None):
    if key is not None and key in shared: return shared[key]
    i=len(verts); verts.append(tuple(co))
    if key is not None: shared[key]=i
    return i

def lerp(a,b,t): return Vector(a)*(1-t)+Vector(b)*t

def body_point(front,r,c):
    v=r/48; u=c/32
    widths=[.49,.50,.51,.53,.57,.61,.64,.63,.58]
    zrows=[.08,.24,.43,.62,.82,1.02,1.20,1.38,1.53]
    def ip(a):
        q=v*(len(a)-1); j=min(len(a)-2,int(q)); f=q-j
        return a[j]*(1-f)+a[j+1]*f
    w=ip(widths); z=ip(zrows); x=(2*u-1)*w
    cross=math.sqrt(max(0,1-(x/w)**2))
    depth=.225*cross*(1-.92*max(0,min(1,(v-.80)/.20))**2*(3-2*max(0,min(1,(v-.80)/.20))))
    y=(-depth if front else depth)
    # Shape shoulder-to-armhole edges into separate front/back seam paths.
    if c in (0,32) and r>=34:
        t=(r-34)/14
        y += (-1 if front else 1)*.042*math.sin(math.pi*t)
    # Very subtle, localized asymmetry to seed cloth drape.
    if front:
        y += .004*math.exp(-(((x+.17)/.22)**2)-(((v-.57)/.18)**2))*math.sin(12*v+4*x)
    if r==48:
        neck=.122 if front else .045
        z -= neck*math.exp(-((x/.145)**4))
    return Vector((x,y,z))

body={'front':[],'back':[]}
for side in ('front','back'):
    front=side=='front'
    grid=[]
    for r in range(49):
        row=[]
        for c in range(33):
            p=body_point(front,r,c)
            key=None
            if c in (0,32):
                if r<=34: key=('side',c,r)
                elif r==48: key=('shoulder-end',c)
            if r==48 and (c<=11 or c>=21): key=('shoulder',c)
            if key in shared:
                vid=shared[key]
            else: vid=add_v(p,key)
            row.append(vid)
        grid.append(row)
    for r in range(48):
        for c in range(32):
            a,b=grid[r][c],grid[r][c+1]; d,e=grid[r+1][c],grid[r+1][c+1]
            faces.append((a,b,e,d) if front else (a,d,e,b))
    body[side]=grid

# Armhole loops reuse actual torso boundary vertices: no sewing springs, no seam gap.
sleeves={}
for sign,label in ((-1,'L'),(1,'R')):
    c=0 if sign<0 else 32
    root=[body['front'][r][c] for r in range(34,49)] + [body['back'][r][c] for r in range(47,34,-1)]
    assert len(root)==28 and len(set(root))==28
    root_pts=[Vector(verts[i]) for i in root]
    center=sum(root_pts,Vector())/len(root_pts)
    axis=Vector((sign*.36,0,-.933)).normalized()
    rings=[root]
    for j in range(1,33):
        t=j/32
        ring=[]
        scale=1-.38*t
        for p in root_pts:
            delta=p-center
            radial=delta-axis*delta.dot(axis)
            q=center+axis*(.91*t)+radial*scale
            # slight elbow bend, asymmetric left/right ease
            q.x += sign*.018*math.sin(math.pi*t)*t
            q.y += .008*math.sin(3*math.pi*t + (.35 if sign<0 else 0))
            ring.append(add_v(q))
        rings.append(ring)
    for j in range(32):
        a,b=rings[j],rings[j+1]
        for k in range(28):
            n=(k+1)%28; faces.append((a[k],a[n],b[n],b[k]))
    sleeves[label]=rings

# Open cuff bands continue from the sleeve boundary loop with shared vertices.
cuffs={}
for sign,label in ((-1,'L'),(1,'R')):
    root=sleeves[label][-1]
    pts=[Vector(verts[i]) for i in root]
    ctr=sum(pts,Vector())/len(pts); axis=Vector((sign*.36,0,-.933)).normalized()
    rings=[root]
    for j in range(1,4):
        t=j/3; rings.append([add_v(Vector(verts[i])+axis*(.075*t)) for i in root])
    for j in range(3):
        for k in range(len(root)):
            n=(k+1)%len(root); faces.append((rings[j][k],rings[j][n],rings[j+1][n],rings[j+1][k]))
    cuffs[label]=rings

# Neck opening perimeter. The collar stand shares its lower loop exactly with the torso.
neck=body['front'][48][11:22] + list(reversed(body['back'][48][12:21]))
assert len(neck)==20 and len(set(neck))==20
neck_pts=[Vector(verts[i]) for i in neck]
stand=[neck]
for step in (1,2):
    row=[]
    for p in neck_pts:
        toward_front=-1 if p.y<0 else 1
        row.append(add_v(p+Vector((0,toward_front*.008*step,.028*step))))
    stand.append(row)
for j in range(2):
    for k in range(len(neck)):
        n=(k+1)%len(neck); faces.append((stand[j][k],stand[j][n],stand[j+1][n],stand[j+1][k]))
# Turned collar leaves share the front upper stand boundary, widening toward rounded tips.
front_top=stand[-1][:11]
for sign,label,segment in ((-1,'L',front_top[:6]),(1,'R',front_top[5:])):
    root_pts=[Vector(verts[i]) for i in segment]
    rows=[segment]
    for j in range(1,9):
        v=j/8; row=[]
        for k in range(6):
            u=k/5; p=lerp(root_pts[0],root_pts[-1],u)
            p.x += sign*(.045*v + (u-.5)*.025*v)
            p.y -= .035*v
            p.z -= .105*v + .012*math.sin(math.pi*u)*math.sin(math.pi*v)
            row.append(add_v(p))
        rows.append(row)
    for j in range(8):
        for k in range(5):
            a,b=rows[j][k],rows[j][k+1]; d,e=rows[j+1][k],rows[j+1][k+1]
            faces.append((a,b,e,d) if sign>0 else (a,d,e,b))

mesh=bpy.data.meshes.new('Welded torso-armhole-collar-cuff cloth shell')
mesh.from_pydata(verts,[],faces); mesh.update()
obj=bpy.data.objects.new('ATEL-53 standalone garment shell · proxy cloth sim',mesh)
bpy.context.scene.collection.objects.link(obj)
for p in mesh.polygons: p.use_smooth=True
fabric=bpy.data.materials.new('Neutral gray cloth'); fabric.diffuse_color=(.34,.36,.38,1); fabric.roughness=.92
hardware=bpy.data.materials.new('Neutral gray trial buttons'); hardware.diffuse_color=(.22,.24,.26,1); hardware.roughness=.8
obj.data.materials.append(fabric)
# Pin only the outer shoulder seam, leaving body/collar/sleeves free to settle on proxies.
for side in ('front','back'):
    for c in (0,1,2,3,29,30,31,32): pins.add(body[side][48][c])
vg=obj.vertex_groups.new(name='Temporary shoulder hold')
for i in pins: vg.add([i],.55,'REPLACE')
cloth=obj.modifiers.new('Cloth drape over temporary collision proxies','CLOTH')
s=cloth.settings
s.quality=8; s.mass=.32; s.tension_stiffness=18; s.compression_stiffness=18
s.shear_stiffness=10; s.bending_stiffness=.12; s.bending_damping=6
s.vertex_group_mass=vg.name; s.pin_stiffness=.7
cs=cloth.collision_settings; cs.use_collision=True; cs.use_self_collision=True
cs.collision_quality=4; cs.distance_min=.012; cs.self_distance_min=.012
scene=bpy.context.scene; scene.frame_start=1; scene.frame_end=FRAME_END
scene.render.fps=24; scene.gravity=(0,0,-.22); scene.unit_settings.system='METRIC'

# Temporary ellipsoid/capsule collision volumes are saved only in the .blend, never exported.
proxy=[]
def add_proxy(name,loc,scale,axis=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,radius=1,location=loc)
    p=bpy.context.object; p.name=name; p.scale=scale
    if axis is not None: p.rotation_euler=Vector(axis).to_track_quat('Z','Y').to_euler()
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    bpy.ops.object.modifier_add(type='COLLISION')
    p.collision.thickness_outer=.015; p.collision.damping=.15
    proxy.append(p)
add_proxy('TEMP collision proxy · torso', (0,0,.80),(.49,.245,.73))
for sign,label in ((-1,'L'),(1,'R')):
    add_proxy(f'TEMP collision proxy · arm {label}',(sign*.79,0,.94),(.115,.115,.50),(sign*.36,0,-.933))
scene.frame_set(1)
for f in range(1,FRAME_END+1):
    scene.frame_set(f)
    if f%12==0: print('SIM_FRAME',f,flush=True)
scene.frame_set(FRAME_END)
bpy.context.view_layer.objects.active=obj; obj.select_set(True)
bpy.ops.object.modifier_apply(modifier=cloth.name)
# Remove all temporary body/arm collision proxies before export.
for p in proxy: bpy.data.objects.remove(p,do_unlink=True)
# Add six low-profile trial buttons seated on the front shell after drape bake.
def surface_at(x,z):
    return min((v.co.copy() for v in obj.data.vertices),key=lambda q:(q.x-x)**2+(q.z-z)**2+.15*(q.y+.22)**2)
buttons=[]
for z in (.36,.55,.74,.93,1.12,1.31):
    q=surface_at(0,z)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=1,location=(q.x,q.y-.006,q.z))
    b=bpy.context.object; b.name=f'Gray trial placket button {z:.2f}'; b.scale=(.012,.004,.012); bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); b.data.materials.append(hardware); buttons.append(b)
# Export garment and trial buttons only. No proxy objects remain in scene or GLB.
bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True)
for b in buttons: b.select_set(True)
bpy.context.view_layer.objects.active=obj
bpy.ops.object.join()
# Normals are consistently recalculated on the final cloth shell.
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BASE,'shirt-proxy-cloth-sim.blend'))
bpy.ops.export_scene.gltf(filepath=OUT,export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
print('EXPORTED',OUT,'verts',len(obj.data.vertices),'faces',len(obj.data.polygons),'proxyObjectsRemaining',len(proxy),flush=True)
