import bpy, sys, os, math, json
from mathutils import Vector
ADDON_ROOT='/tmp/atelierx-blender-tools/opensew-2'
if ADDON_ROOT not in sys.path: sys.path.insert(0,ADDON_ROOT)
import clothing_design
from clothing_design import avatar, library, patterns, build, sim, props

BASE=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.join(BASE,'opensew2-shirt-wip.glb')
clothing_design.register()
scn=bpy.context.scene
# OpenSew2's own fitting avatar is temporary working-scene geometry only.
scn.cd.figure='MAN'; scn.cd.resolution=.012; scn.cd.keep_off_body=True
scn.cd.quality=10; scn.cd.mass=.28; scn.cd.stiff_tension=20
scn.cd.stiff_compress=55; scn.cd.stiff_shear=8; scn.cd.stiff_bend=7
scn.cd.air_damping=1.4; scn.cd.self_collision=True; scn.cd.coll_distance=.004
scn.cd.stitch_frames=24; scn.cd.settle_frames=55; scn.cd.stitch_gravity=.12
scn.cd.auto_close=True; scn.cd.weld_seams=True; scn.cd.weld_dist=.045
scn.cd.subdiv_levels=0; scn.cd.subdiv_render=0; scn.cd.thickness=0.0; scn.cd.bind_armature=False
bpy.ops.cd.import_character(figure='MAN')
m=avatar.measure(bpy.context,force=True)
if not m: raise RuntimeError('OpenSew2 avatar measurement failed')

# Draft a fresh tailored shirt block from OpenSew2, with fitted full-length sleeves.
arm_total=sum(m.get('limbs',{}).get(k,{}).get('len',0.0) for k in ('arm_l','farm_l'))
gname='ATEL53_OpenSew2_Shirt'
pieces,seams=library.preset_jacket(m,fit=.16,length_to='hip',sleeve_len=max(.36,arm_total*1.02),closed_front=False)
byname={spec['name']:spec for spec in pieces}
made={}
def add_piece(spec):
    ob=patterns.create_panel(bpy.context,f'{gname}_{spec["name"]}',spec['segs'],garment=gname,
       anchor=spec.get('anchor','TORSO_FRONT'),height=spec.get('height',.5),ease=spec.get('ease',.02),
       wrap=spec.get('wrap',1.0),spin=spec.get('spin',0.0),taper=spec.get('taper',0.0))
    made[spec['name']]=ob
    return ob
for spec in pieces: add_piece(spec)

# Add matching hollow cuff bands. The band's upper edge follows the drafted sleeve hem;
# its two short edges sew together, leaving the wrist opening open.
def seg_pts(spec,name):
    for n,pts in spec['segs']:
        if n==name: return [Vector(p) for p in pts]
    raise KeyError((spec['name'],name))
def curve_len(points): return sum((points[i+1]-points[i]).length for i in range(len(points)-1))
def rect_pattern(width,height,bottom,top,left,right):
    x0=-width/2; x1=width/2; z0=-height/2; z1=height/2
    return [(bottom,[Vector((x0,z0)),Vector((x1,z0))]),
            (right,[Vector((x1,z0)),Vector((x1,z1))]),
            (top,[Vector((x1,z1)),Vector((x0,z1))]),
            (left,[Vector((x0,z1)),Vector((x0,z0))])]
for label,anchor in (('L','ARM_L'),('R','ARM_R')):
    sleeve=byname[f'Sleeve_{label}']; w=curve_len(seg_pts(sleeve,'hem')); ch=.060
    # limb height 0.96 targets the distal forearm/wrist. Pattern y is local -Z along the arm.
    spec={'name':f'Cuff_{label}','segs':rect_pattern(w,ch,'opening','hem','side_a','side_b'),
          'anchor':anchor,'height':.965,'ease':.012,'wrap':1.0}
    cuff=add_piece(spec)
    seams.append((f'Sleeve_{label}','hem',f'Cuff_{label}','hem',None))
    seams.append((f'Cuff_{label}','side_a',f'Cuff_{label}','side_b',None))

# Draft a low, continuous collar stand as three OpenSew pattern panels, then two broad,
# curved leaf panels that fold over the chest. Each seam is length-matched to the neck edge.
frontL=byname['Front_L']; frontR=byname['Front_R']; back=byname['Back']
neckL=curve_len(seg_pts(frontL,'neck_L')); neckR=curve_len(seg_pts(frontR,'neck_R')); neckB=curve_len(seg_pts(back,'neck'))
shoulder_z=avatar.z_of(m,'shoulder')
collar_h=.038; leaf_h=.105
base_z=shoulder_z+.012
base_height=(base_z-collar_h*.5-m['zmin'])/m['height']
leaf_height=(base_z+collar_h+leaf_h*.5-m['zmin'])/m['height']
stand_specs=[
 {'name':'Stand_Back','segs':rect_pattern(neckB,collar_h,'neck','top','end_l','end_r'),'anchor':'TORSO_BACK','height':base_height,'ease':.010},
 {'name':'Stand_Front_L','segs':rect_pattern(neckL,collar_h,'neck','top','end_l','end_r'),'anchor':'TORSO_FRONT','height':base_height,'ease':.010},
 {'name':'Stand_Front_R','segs':rect_pattern(neckR,collar_h,'neck','top','end_l','end_r'),'anchor':'TORSO_FRONT','height':base_height,'ease':.010},
]
for spec in stand_specs: add_piece(spec)
# Continuous band connections and neck attachments.
seams.extend([
 ('Stand_Front_L','neck','Front_L','neck_L',None),
 ('Stand_Front_R','neck','Front_R','neck_R',None),
 ('Stand_Back','neck','Back','neck',None),
 ('Stand_Back','end_l','Stand_Front_L','end_l',None),
 ('Stand_Back','end_r','Stand_Front_R','end_r',None),
 ('Stand_Front_L','end_r','Stand_Front_R','end_l',None),
])
# Leaf panels: the root matches each front stand top; the curved outer contour widens and
# drops toward the placket. No pointed triangular tip.
def leaf_spec(name,width,sign):
    half=width*.5; outer=width*.74; h=leaf_h
    # closed boundary ordered from root-left to root-right and around rounded distal edge
    root=[Vector((-half,0)),Vector((half,0))]
    # eased, slightly rounded outside edge
    right=[Vector((half,0)),Vector((outer*.95,-h*.40)),Vector((outer*.70,-h*.83)),Vector((outer*.40,-h))]
    tip=[Vector((outer*.40,-h)),Vector((0,-h*1.04)),Vector((-outer*.40,-h))]
    left=[Vector((-outer*.40,-h)),Vector((-outer*.70,-h*.83)),Vector((-outer*.95,-h*.40)),Vector((-half,0))]
    if sign<0:
        root=[Vector((-p.x,p.y)) for p in reversed(root)]
        right,left=left,right
        right=[Vector((-p.x,p.y)) for p in reversed(right)]
        tip=[Vector((-p.x,p.y)) for p in reversed(tip)]
        left=[Vector((-p.x,p.y)) for p in reversed(left)]
    return {'name':name,'segs':[('root',root),('outer',right),('tip',tip),('inner',left)],
            'anchor':'TORSO_FRONT','height':leaf_height,'ease':.012,'wrap':1.0}
for label,width,sign,stand in (('L',neckL,-1,'Stand_Front_L'),('R',neckR,1,'Stand_Front_R')):
    spec=leaf_spec(f'Collar_Leaf_{label}',width,sign); add_piece(spec)
    seams.append((spec['name'],'root',stand,'top',None))

# Add seams using OpenSew2's own data structures and full pattern assembly.
for a,sa,b,sb,flip in seams:
    seam=scn.cd.seams.add(); seam.name=f'{a}.{sa} - {b}.{sb}'
    seam.obj_a=made[a]; seam.seg_a=sa; seam.obj_b=made[b]; seam.seg_b=sb
    if flip is not None: seam.flip=flip; seam.auto_flip=False
scn.cd.garment_name=gname
shirt=build.sync_garment(bpy.context,None,gname)
if shirt is None: raise RuntimeError('OpenSew2 pattern assembly failed')
shirt.cd.layer=0
sim.setup_cloth(bpy.context,shirt); sim.ensure_collider(bpy.context,scn.cd.avatar); sim.setup_layers(bpy.context)
# Use add-on's exact low-gravity stitch -> weld paired seam vertices -> full-gravity settle.
bpy.ops.object.select_all(action='DESELECT'); shirt.select_set(True); bpy.context.view_layer.objects.active=shirt
ret=bpy.ops.cd.sew()
print('OPEN_SEW2_SEW',ret,'frame',scn.frame_current,'weldDist',scn.cd.weld_dist,flush=True)
# OpenSew2's own relaxation pass softens the woven drape and lets collar leaves rest.
bpy.ops.cd.relax(take_in=.018)
print('OPEN_SEW2_RELAX','frame',scn.frame_current,flush=True)
# Bake the final cloth shape, remove the solver, then add subtle gray trial buttons.
sim.bake_shape(bpy.context,shirt)
for mod in list(shirt.modifiers):
    if mod.type=='CLOTH': shirt.modifiers.remove(mod)
# Neutral gray appearance; replace add-on default pale material with review gray.
for mat in shirt.data.materials:
    if mat:
        mat.diffuse_color=(.34,.36,.38,1)
        mat.roughness=.9
for z in (1.30,1.10,.90,.70,.50,.32):
    v=min((x.co.copy() for x in shirt.data.vertices),key=lambda p:(p.x-.012)**2+(p.z-z)**2+.1*(p.y+.22)**2)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=1,location=(v.x,v.y-.004,v.z))
    btn=bpy.context.object; btn.name=f'Gray trial shirt button {z:.2f}'; btn.scale=(.010,.004,.010)
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    btn.data.materials.append(bpy.data.materials.new('Neutral gray trial hardware'))
    btn.data.materials[0].diffuse_color=(.22,.24,.26,1)
    bpy.ops.object.select_all(action='DESELECT'); shirt.select_set(True); btn.select_set(True); bpy.context.view_layer.objects.active=shirt
    bpy.ops.object.join()
# Working blend retains the temporary fitting avatar; final GLB includes only garment.
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(BASE,'opensew2-shirt-simulation.blend'))
for o in bpy.context.selected_objects: o.select_set(False)
shirt.select_set(True); bpy.context.view_layer.objects.active=shirt
bpy.ops.export_scene.gltf(filepath=OUT,export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
print('EXPORTED',OUT,'verts',len(shirt.data.vertices),'faces',len(shirt.data.polygons),'garmentOnly',True,flush=True)
