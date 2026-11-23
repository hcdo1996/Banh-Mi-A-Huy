/* Bánh Mì A Huy — game data (characters, recipes, drinks, days, story) */
const L=(vi,en)=>({vi,en});

/* ---------- characters ---------- */
// faces map game moods -> sprite file suffix (assets/c_<id>_<suffix>.webp)
const CHARS={
 co_ba:{name:'Cô Ba',special:'coba',voice:'co_ba'},
 anh_tuan:{name:'Anh Tuấn',faces:{front:'front',happy:'happy',angry:'angry',shocked:'shocked',eating:'eating'},voice:'anh_tuan'},
 be_ti:{name:'Bé Tí',faces:{front:'front',happy:'happy',angry:'angry',shocked:'shocked',eating:'eating'},voice:'be_ti',h:560},
 chi_linh:{name:'Chị Linh',faces:{front:'front',happy:'happy',angry:'angry',shocked:'shocked',eating:'eating'},voice:'chi_linh'},
 mai:{name:'Mai',faces:{front:'front',happy:'cheer',angry:'front',shocked:'front',eating:'cheer'},voice:'mai'},
 bao:{name:'Bảo',faces:{front:'front',happy:'front',angry:'front',shocked:'shocked',eating:'front'},voice:'bao'},
 van:{name:'Cô Vân',faces:{front:'front',happy:'laugh',angry:'shy',shocked:'shy',eating:'laugh'},voice:'van'},
 chu_tu:{name:'Chú Tư',faces:{front:'front',happy:'happy',angry:'impatient',shocked:'shocked',eating:'eating'},voice:'chu_tu'},
 ba_sau:{name:'Bà Sáu',faces:{front:'front',happy:'excited',angry:'sulking',shocked:'shocked',eating:'laughing'},voice:'ba_sau'},
 kevin:{name:'Kevin',faces:{front:'front',happy:'smug',angry:'angry',shocked:'shocked',eating:'eating'},voice:'kevin'},
 tom:{name:'Tom',faces:{front:'front',happy:'thumbs_up',angry:'confused',shocked:'shocked',eating:'eating'},voice:'tom'},
 co_hanh:{name:'Cô giáo Hạnh',faces:{front:'front',happy:'smile',angry:'strict',shocked:'shocked',eating:'smile'},voice:'co_hanh'},
 ong_nam:{name:'Ông Năm',faces:{front:'front',happy:'laughing',angry:'grumpy',shocked:'shocked',eating:'eating'},voice:'ong_nam'},
 chi_thu:{name:'Chị Thu',faces:{front:'front',happy:'happy',angry:'grumpy',shocked:'shocked',eating:'eating'},voice:'chi_thu'},
 minh:{name:'Minh Gym',faces:{front:'front',happy:'happy',angry:'impatient',shocked:'shocked',eating:'eating'},voice:'minh'},
 be_bong:{name:'Bé Bông',faces:{front:'front',happy:'jump',angry:'pout',shocked:'cry',eating:'eating'},voice:'be_bong',h:520},
 anh_son:{name:'Anh Sơn',faces:{front:'front',happy:'happy',angry:'tired',shocked:'shocked',eating:'eating'},voice:'anh_son'},
 coach:{name:'Coach Tài Lộc',faces:{front:'front',happy:'happy',angry:'smug',shocked:'shocked',eating:'eating'},voice:'coach'},
 chot:{name:'Chị Bé Chốt Đơn',faces:{front:'front',happy:'happy',angry:'annoyed',shocked:'shocked',eating:'eating'},voice:'chot'},
 tu_mukbang:{name:'Anh Tư Mukbang',faces:{front:'front',happy:'happy',angry:'sad',shocked:'shocked',eating:'eating'},voice:'tu_mukbang'},
 su_genz:{name:'Bé Su',faces:{front:'front',happy:'happy',angry:'bored',shocked:'shocked',eating:'eating'},voice:'su_genz'},
 shipper:{name:'Anh Long Shipper',faces:{front:'front',happy:'happy',angry:'stressed',shocked:'shocked',eating:'eating'},voice:'shipper'},
 co_dieu:{name:'Cô Diệu',faces:{front:'front',happy:'happy',angry:'impatient',shocked:'horrified',eating:'eating'},voice:'co_dieu'},
 ong_thanh:{name:'Ông Thăng',faces:{front:'front',happy:'happy',angry:'skeptical',shocked:'shocked',eating:'eating'},voice:'ong_thanh'},
 chu_hai:{name:'Chú Hai',faces:{front:'front',happy:'happy',angry:'front',shocked:'shocked',eating:'happy'},voice:'chu_hai'},
};
// voice clip index per mood: 0 arrive/order, 1 hurry, 2 wrong, 3 happy/eat, 4 leave
const VO={arrive:0,hurry:1,wrong:2,happy:3,leave:4};

/* ---------- ingredients / recipes ---------- */
const ING={cha_lua:L('Chả lụa','Pork roll'),ham:L('Thịt nguội','Ham'),xa_xiu:L('Xá xíu','BBQ pork'),xiu_mai:L('Xíu mại','Meatballs'),egg:L('Trứng ốp la','Fried egg'),do_chua:L('Đồ chua','Pickles'),cucumber:L('Dưa leo','Cucumber'),green_onion:L('Hành lá','Scallion'),cilantro:L('Ngò','Cilantro'),chili:L('Ớt','Chili')};
const VEG=['do_chua','cucumber','green_onion','cilantro','chili'];
const MEAT=['cha_lua','ham','xa_xiu','xiu_mai','egg'];
const RECIPES={
 thit_nguoi:{n:L('Bánh mì thịt nguội','Cold-cut bánh mì'),req:{ham:1,cha_lua:1,do_chua:1,cucumber:1,cilantro:1},price:25000},
 cha_lua:{n:L('Bánh mì chả lụa','Pork-roll bánh mì'),req:{cha_lua:1,do_chua:1,cilantro:1},price:20000},
 op_la:{n:L('Bánh mì ốp la','Fried-egg bánh mì'),req:{egg:1,do_chua:1,cucumber:1,green_onion:1},price:20000},
 xa_xiu:{n:L('Bánh mì xá xíu','BBQ-pork bánh mì'),req:{xa_xiu:1,do_chua:1,cucumber:1,cilantro:1},price:25000,day:4},
 xiu_mai:{n:L('Bánh mì xíu mại','Meatball bánh mì'),req:{xiu_mai:1,do_chua:1,green_onion:1,cilantro:1},price:25000,day:4},
 dac_biet:{n:L('Bánh mì đặc biệt','Special bánh mì'),req:{ham:1,cha_lua:1,xa_xiu:1,do_chua:1,cucumber:1,cilantro:1},price:35000,day:5},
};
const SAUCES={soy:L('Nước tương','Soy sauce'),fish:L('Nước mắm','Fish sauce'),chili:L('Tương ớt','Chili sauce')};

/* ---------- drinks ---------- */
// steps: tap item (count), hold item into band [lo,hi] of cup (fraction), stir (circle drag), shake (up-down drag)
const DRINKS={
 cafe:{n:L('Cà phê sữa đá','Iced milk coffee'),price:20000,day:2,cup:'glass',
  steps:[{t:'tap',item:'phin',n:1,lab:L('Đặt phin lên ly','Put the phin on the glass')},
         {t:'hold',item:'kettle',layer:'#3b2010',band:[.30,.45],lab:L('Giữ để rót nước sôi vào phin','Hold to pour hot water')},
         {t:'hold',item:'milk',layer:'#f3e6c4',band:[.50,.62],lab:L('Giữ để rót sữa đặc','Hold to pour condensed milk')},
         {t:'tap',item:'ice',n:2,lab:L('Bỏ đá','Add ice')},
         {t:'stir',lab:L('Xoay tròn để khuấy','Circle to stir')}]},
 tra_dao:{n:L('Trà đào cam sả','Peach lemongrass tea'),price:30000,day:3,cup:'glass',
  steps:[{t:'hold',item:'tea',layer:'#d98a2b',band:[.55,.70],lab:L('Giữ để rót trà','Hold to pour tea')},
         {t:'tap',item:'peach',n:3,lab:L('Thả 3 lát đào','Drop 3 peach slices')},
         {t:'tap',item:'orange',n:1,lab:L('Thả 1 lát cam','Drop an orange slice')},
         {t:'tap',item:'lemongrass',n:1,lab:L('Cắm cây sả','Add lemongrass')},
         {t:'tap',item:'ice',n:2,lab:L('Bỏ đá','Add ice')}]},
 chanh_day:{n:L('Nước chanh dây','Passion fruit juice'),price:20000,day:5,cup:'glass',
  steps:[{t:'tap',item:'passion',n:2,lab:L('Múc 2 trái chanh dây','Scoop 2 passion fruits')},
         {t:'hold',item:'syrup',layer:'#f7e9a0',band:[.18,.28],lab:L('Giữ để rót nước đường','Hold to pour syrup')},
         {t:'hold',item:'water',layer:'#f5c542',band:[.60,.75],lab:L('Giữ để rót nước','Hold to pour water')},
         {t:'tap',item:'ice',n:2,lab:L('Bỏ đá','Add ice')},
         {t:'shake',lab:L('Kéo lên xuống để lắc','Drag up and down to shake')}]},
 nuoc_ep:{n:L('Nước ép trái cây','Fresh juice'),price:25000,day:6,cup:'glass',fruit:true,
  steps:[{t:'fruit',lab:L('Bỏ đúng trái cây vào máy ép','Put the right fruit in the juicer')},
         {t:'hold',item:'press',layer:'fruit',band:[.65,.80],lab:L('Giữ nút để ép','Hold to juice')},
         {t:'tap',item:'ice',n:1,lab:L('Bỏ đá','Add ice')}]},
};
const FRUITS={cam:{n:L('Cam','Orange'),c:'#f59a1c'},thom:{n:L('Thơm','Pineapple'),c:'#f2cf3a'},dua_hau:{n:L('Dưa hấu','Watermelon'),c:'#e8434f'}};
const DITEM={phin:L('Phin','Phin'),kettle:L('Ấm nước','Kettle'),milk:L('Sữa đặc','Condensed milk'),ice:L('Đá','Ice'),tea:L('Trà','Tea'),peach:L('Đào','Peach'),orange:L('Cam','Orange'),lemongrass:L('Sả','Lemongrass'),passion:L('Chanh dây','Passion fruit'),syrup:L('Nước đường','Syrup'),water:L('Nước','Water'),press:L('Nút ép','Press'),cam:L('Cam','Orange'),thom:L('Thơm','Pineapple'),dua_hau:L('Dưa hấu','Watermelon')};

/* ---------- upgrades ---------- */
const UPGRADES={
 knife:{n:L('Dao bén','Sharp knife'),d:L('Xẻ bánh chỉ cần kéo nửa ổ','Slice with half a drag'),price:120000,icon:'🔪'},
 rattle:{n:L('Lục lạc của Chloe','Chloe\'s rattle'),d:L('Chloe nín nhanh hơn','Chloe calms down faster'),price:100000,icon:'🔔'},
 bone:{n:L('Hũ xương cho Kẹo','Bone jar for Kẹo'),d:L('Kẹo ghé chào, không trộm','Kẹo visits, no stealing'),price:90000,icon:'🦴'},
 spread:{n:L('Phết đều tay','Steady spreading'),d:L('Phết bơ, pa-tê nhanh gấp rưỡi','Spread 1.5× faster'),price:150000,icon:'🧈'},
 fan:{n:L('Quạt máy','Electric fan'),d:L('Khách kiên nhẫn lâu hơn 15%','Customers 15% more patient'),price:200000,icon:'🌀'},
 speaker:{n:L('Loa bolero','Bolero speaker'),d:L('Tiền tip +20%','Tips +20%'),price:230000,icon:'🔊'},
 pour:{n:L('Bình rót có vạch','Measuring jug'),d:L('Vạch rót rộng hơn','Wider pour zone'),price:180000,icon:'<img src="assets/d_kettle.webp" alt="" style="height:1em">'},
 led:{n:L('Bảng hiệu đèn LED','LED sign'),d:L('Tip cao hơn, khách vui hơn','Bigger tips, happier customers'),price:300000,icon:'💡'},
};

/* ---------- days ---------- */
// each customer entry: {c:charId, o:order overrides, gag:key}
const DAYS={
 1:{patience:80,queue:1,gap:6,targets:[40000,55000,65000],
   cust:[{c:'co_ba',o:{r:'thit_nguoi',chili:1},gag:'haggle1'},{c:'anh_tuan',o:{r:'cha_lua',noChili:1}},{c:'be_ti',o:{r:'op_la',chili:1,sauce:'chili'},gag:'coins'}],
   events:[{type:'dog',onCust:1}]},
 2:{patience:80,queue:1,gap:7,targets:[80000,110000,135000],
   cust:[{c:'co_ba',o:{r:'thit_nguoi',chili:1},gag:'haggle2'},{c:'chu_tu',o:{r:'cha_lua',drink:'cafe'},gag:'usual_first'},{c:'chi_linh',o:{r:'cha_lua',qty:3}},{c:'anh_tuan',o:{r:'thit_nguoi',noChili:1,drink:'cafe'}},{c:'shipper',o:{r:'op_la',qty:2},gag:'shipper'}],
   events:[{type:'chloe',onCust:2},{type:'dog',onCust:4}]},
 3:{patience:76,queue:2,gap:12,targets:[100000,140000,180000],
   cust:[{c:'mai',o:{r:'thit_nguoi',drink:'tra_dao'},gag:'live'},{c:'ba_sau',o:{r:'op_la'},gag:'lottery'},{c:'su_genz',o:{r:'cha_lua',noChili:1,drink:'tra_dao'},gag:'genz'},{c:'be_ti',o:{r:'op_la',chili:1,sauce:'chili'},gag:'coins'},{c:'chi_thu',o:{r:'cha_lua',drink:'cafe',strong:1}},{c:'co_ba',o:{r:'cha_lua'},gag:'haggle3'},{c:'anh_tuan',o:{r:'cha_lua',noChili:1}}],
   events:[{type:'rain',onCust:3},{type:'chloe',onCust:5}]},
 4:{patience:74,queue:2,gap:12,targets:[130000,180000,230000],
   cust:[{c:'bao',o:{r:'xiu_mai',sauce:'fish'},gag:'viral'},{c:'coach',o:{r:'xa_xiu',drink:'cafe'},gag:'coach'},{c:'chi_linh',o:{r:'cha_lua',qty:3},gag:'change'},{c:'be_bong',o:{r:'egg_only'}},{c:'co_ba',o:{r:'xa_xiu',chili:1,drink:'tra_dao'},gag:'haggle4'},{c:'anh_son',o:{r:'thit_nguoi',qty:3}},{c:'anh_tuan',o:{r:'xa_xiu',noChili:1,drink:'cafe'}}],
   events:[{type:'speaker',onCust:1},{type:'dog',onCust:5}]},
 5:{patience:72,queue:2,gap:11,targets:[150000,210000,270000],
   cust:[{c:'tom',o:{r:'dac_biet',noCilantro:1,drink:'chanh_day'},gag:'english'},{c:'be_ti',o:{r:'op_la',chili:1,sauce:'chili'},gag:'teacher'},{c:'co_dieu',o:{r:'cha_lua',noButter:1,noPate:1,drink:'chanh_day'}},{c:'mai',o:{r:'dac_biet',drink:'tra_dao'},gag:'live'},{c:'chot',o:{r:'thit_nguoi'},gag:'chotdon'},{c:'minh',o:{r:'dac_biet',extraMeat:1}},{c:'chi_thu',o:{r:'xa_xiu',drink:'cafe',strong:1}},{c:'anh_tuan',o:{r:'xiu_mai',noChili:1}}],
   events:[{type:'power',onCust:3},{type:'chloe',onCust:6}]},
 6:{patience:70,queue:2,gap:10,targets:[170000,240000,310000],rumor:1,
   cust:[{c:'ong_thanh',o:{r:'dac_biet',chili:1,sauce:'fish',drink:'nuoc_ep'},gag:'inlaw'},{c:'van',o:{r:'thit_nguoi',drink:'nuoc_ep'}},{c:'ba_sau',o:{r:'xiu_mai'},gag:'lottery_result'},{c:'co_ba',o:{r:'dac_biet'},gag:'haggle5'},{c:'anh_son',o:{r:'xa_xiu',qty:3}},{c:'be_bong',o:{r:'egg_only',drink:'nuoc_ep'}},{c:'tu_mukbang',o:{r:'thit_nguoi',qty:3},gag:'mukbang'},{c:'ong_nam',o:{r:'xiu_mai',drink:'cafe'}},{c:'anh_tuan',o:{r:'cha_lua',noChili:1}}],
   events:[{type:'doggang',onCust:2},{type:'chloe',onCust:5}]},
 7:{contest:1,patience:70,targets:[1,2,3]},
 8:{endless:1,patience:80,queue:2,gap:9,targets:[1e12,1e12,1e12],cust:[],events:[{type:'dog',onCust:3},{type:'chloe',onCust:6},{type:'rain',onCust:9},{type:'dog',onCust:12},{type:'power',onCust:15},{type:'chloe',onCust:18},{type:'doggang',onCust:22},{type:'chloe',onCust:26}]},
};

/* ---------- order text helpers ---------- */
const DAYNAME={8:L('Bán tới sáng','Open till dawn'),1:L('Một mình một tiệm','Flying solo'),2:L('Sếp Na ra quân','Boss Na arrives'),3:L('Lên sóng','Going viral'),4:L('Kẻ thù bên kia đường','The rival'),5:L('Khách Tây và cô giáo','The tourist and the teacher'),6:L('Tin đồn','The rumor'),7:L('Hội thi bánh mì Long Khánh','The Long Khánh Bánh Mì Contest')};

/* ---------- story scripts ---------- */
const NIGHT='rgba(25,35,90,.45)',DAY='rgba(0,0,0,0)',EVE='rgba(120,50,20,.38)',RAIN='rgba(40,60,90,.4)';
const STORY={
 intro1:[
 {who:'narr',cal:['5:30',L('Sáng sớm','Early morning')],tint:NIGHT,t:L('Long Khánh, 5 giờ 30 sáng. Tiệm bánh mì của Má Lan chuẩn bị mở cửa.','Long Khánh, 5:30 a.m. Mom Lan\'s bánh mì stall is about to open.')},
 {who:'ma',f:'strict',t:L('Huy! Dậy chưa con? Xe đò ra Đà Lạt 6 giờ chạy rồi!','Huy! Are you up? The bus to Đà Lạt leaves at six!'),vo:'ma_0'},
 {who:'huy',f:'shocked',t:L('Dạ con dậy rồi! …Mà sao má đi lâu vậy?','I\'m up! …Why are you going for so long?'),vo:'huy_6'},
 {who:'ma',f:'happy',t:L('Một tuần thôi. Hội bạn má đi ngắm hoa dã quỳ. Ba chục năm má chưa nghỉ ngày nào đó nha.','Just one week. My friends and I are going to see the wild sunflowers. I haven\'t had a day off in thirty years.'),vo:'ma_5'},
 {who:'huy',f:'happy',t:L('Má yên tâm. Con coi YouTube làm bánh mì hết rồi.','Relax, Mom. I watched every bánh mì video on YouTube.'),vo:'huy_7'},
 {who:'ma',f:'strict',t:L('YouTube đâu có dạy đối phó cô Ba!','YouTube doesn\'t teach you how to handle Cô Ba!'),vo:'ma_6'},
 {who:'huy',f:'front',t:L('…Cô Ba là ai má?','…Who\'s Cô Ba?'),vo:'huy_8'},
 {who:'ma',f:'front',t:L('Cô Ba bán rau đầu hẻm. Cô hay nói "má con hồi đó bớt cho cô". Má chưa bớt cho cô đồng nào hết.','She sells vegetables at the alley corner. She\'ll say "your mom always gave me a discount". I never gave her a single đồng.'),vo:'ma_7'},
 {who:'ma',f:'strict',t:L('Thằng Tuấn thì lúc nào cũng "không ớt". Bé Tí thì trả bằng xu. Còn con Kẹo…','Tuấn always says "no chili". Bé Tí pays in coins. And that dog Kẹo…'),vo:'ma_8'},
 {who:'keo',t:L('Gâu!','Woof!'),sfx:'bark'},
 {who:'ma',f:'shocked',t:L('…thấy nó là giữ chả lụa lại liền!','…when you see it, guard the pork roll!'),vo:'ma_9'},
 {who:'mochi',t:L('Meo. (Mochi nhìn A Huy kiểu "mày làm được không?")','Meow. (Mochi stares at Huy: "can you even do this?")'),sfx:'meo'},
 {who:'huy',f:'angry_side',t:L('Con mèo này nhìn khinh con kìa má.','Mom, the cat is judging me.'),vo:'huy_9'},
 {who:'ma',f:'happy',t:L('Mochi là quản lý. Nó báo cáo hết cho má đó.','Mochi is the manager. She reports everything to me.'),vo:'ma_10'},
 {who:'ma',f:'video_call',t:L('Tối nào má cũng gọi video kiểm tra. Bán dở là má biết liền!','I\'ll video call every night. If sales are bad, I\'ll know!'),vo:'ma_11'},
 {who:'huy',f:'happy',t:L('Dạ! Một tuần thôi mà, dễ ợt!','Got it! It\'s only a week, easy!'),vo:'huy_5'},
 {who:'ma',f:'back',t:L('…Ừ. Dễ ợt.','…Sure. Easy.'),hideAfter:'L',vo:'ma_12'},
 {who:'narr',cal:['6:00',L('Mở hàng','Opening time')],tint:DAY,t:L('Xe đò chạy mất. Tiệm bánh mì chính thức… vào tay A Huy.','The bus drives off. The stall is officially… in Huy\'s hands.')},
 {who:'na',f:'blouse_video_call',t:L('Anh ơi! Em đưa Chloe đi chích ngừa nha. Hôm ni anh bán một mình. Đừng làm chi dại đó.','Honey! I\'m taking Chloe for her shots. You\'re alone at the stall today. Don\'t do anything silly.'),vo:'na_5'},
 {who:'huy',f:'shocked',t:L('Dại là sao em?','Silly like what?'),vo:'huy_10'},
 {who:'na',f:'blouse_unimpressed',t:L('Là… đừng làm chi hết. Bán thôi. Rứa thôi.','Like… don\'t do anything. Just sell. That\'s it.'),vo:'na_6'},
 {who:'huy',f:'happy',t:L('Dạ sếp! Bánh Mì A Huy, mở hàng!','Yes, boss! Bánh Mì A Huy is open!'),vo:'huy_11'},
 ],
 intro2:[
 {who:'narr',cal:['6:00',L('Ngày 2','Day 2')],tint:DAY,t:L('Sáng ngày 2. Hôm nay Na ra quầy, Chloe ngồi xe tập đi bên cạnh.','Day 2. Today Na joins at the counter, with Chloe in her baby walker.')},
 {who:'na',f:'blouse_happy',t:L('Anh ơi, hôm ni mình bán thêm cà phê sữa đá. Cà phê phải đậm. Anh pha nhạt là em biết liền.','Today we add iced milk coffee. It must be strong. If you make it weak, I\'ll know.'),vo:'na_1'},
 {who:'huy',f:'happy',t:L('Cà phê thì dễ ợt. Rót, khuấy, xong.','Coffee is easy. Pour, stir, done.'),vo:'huy_12'},
 {who:'na',f:'blouse_unimpressed',t:L('Phin phải nhỏ giọt từ từ. Sữa đặc vừa tới vạch. Đá hai cục. Khuấy đều. Anh nhớ chưa?','The phin drips slowly. Condensed milk up to the line. Two ice cubes. Stir well. Got it?'),vo:'na_7'},
 {who:'huy',f:'shocked',t:L('…Em nói lại từ "phin" được không?','…Can you start again from "phin"?'),vo:'huy_13'},
 {who:'chloe',f:'sit_smile',t:L('Hi hi hi!','Hehehe!'),vo:'chloe_0'},
 {who:'na',f:'blouse_laughing',t:L('Con cũng cười ba kìa. Thôi, mở hàng!','Even Chloe is laughing at you. Let\'s open!'),vo:'na_8'},
 ],
 intro3:[
 {who:'narr',cal:['6:00',L('Ngày 3','Day 3')],tint:DAY,t:L('Ngày 3. Tin đồn về "anh chủ tiệm bánh mì hậu đậu" bắt đầu lan khắp xóm.','Day 3. Word about "the clumsy bánh mì guy" spreads around the neighborhood.')},
 {who:'na',f:'blouse_happy',t:L('Hôm ni thêm trà đào cam sả. Trà vừa tới vạch, 3 lát đào, 1 lát cam, 1 cây sả.','Today we add peach lemongrass tea. Tea to the line, 3 peach slices, 1 orange slice, 1 lemongrass.'),vo:'na_9'},
 {who:'na',f:'blouse_unimpressed',t:L('Mà nghe nói con Mai hay livestream ghé tiệm mình. Anh đừng làm chi quê nghe.','And I heard Mai the livestreamer might visit. Don\'t embarrass us.'),vo:'na_10'},
 {who:'huy',f:'happy',t:L('Lên sóng hả? Anh đẹp trai sẵn rồi.','On camera? I\'m already handsome.'),vo:'huy_14'},
 {who:'na',f:'blouse_laughing',t:L('Ui chao ơi, anh này!','Oh my goodness, you!'),vo:'na_2'},{who:'na',f:'blouse_unimpressed',t:L('Mà anh nhớ: đừng nói "khum", đừng nói "ét o ét". Anh ba mấy tuổi rồi.','And remember: don\'t say "khum" or "ét o ét". You\'re in your thirties.')},{who:'huy',f:'shocked',t:L('…"Khum" là gì em?','…What does "khum" mean?')},{who:'na',f:'blouse_laughing',t:L('Là "không". Anh tối cổ quá trời.','It means "no". You\'re so out of touch.')},
 ],
 intro4:[
 {who:'narr',cal:['6:00',L('Ngày 4','Day 4')],tint:DAY,t:L('Ngày 4. Bên kia đường, một tiệm mới khai trương: "Bánh Mì Sang Chảnh". Loa kéo mở hết cỡ.','Day 4. Across the street a new shop opens: "Fancy Bánh Mì". The speaker is at full blast.')},
 {who:'kevin',f:'front',t:L('Yo bro! Tui là Kevin. Bánh mì fusion, dát vàng, 99 nghìn một ổ!','Yo bro! I\'m Kevin. Fusion bánh mì, gold leaf, 99k each!'),vo:'kevin_0'},
 {who:'kevin',f:'happy',t:L('Xe đẩy với phin cà phê… old school quá bro!','Street carts and phin coffee… so old school, bro!'),vo:'kevin_1'},
 {who:'na',f:'blouse_unimpressed',t:L('Ông tê nói chi mà em nghe không lọt tai.','Whatever that guy is saying, I\'m not having it.'),vo:'na_11'},
 {who:'huy',f:'angry_side',t:L('Bánh mì mà dát vàng thì ăn sao? Gãy răng hả?','Gold leaf on bánh mì? You want people to break a tooth?'),vo:'huy_15'},{who:'kevin',f:'happy',t:L('Tiệm tui còn có bánh mì làm bằng AI nữa nha bro!','My shop even has AI-made bánh mì, bro!')},{who:'huy',f:'happy',t:L('Tiệm anh cũng có AI. A-Iu… là "anh iu Na" đó.','My shop has AI too. "A-Iu"… as in "anh iu Na".')},{who:'na',f:'blouse_unimpressed',t:L('…Bán đi anh. Em hướng nội hết phần đời còn lại luôn á.','…Just sell, dear. I\'m so embarrassed I could vanish.')},
 {who:'na',f:'blouse_happy',t:L('Hôm ni mình thêm xá xíu với xíu mại. Loa nhà hắn ồn lắm, anh nhìn phiếu cho kỹ nha.','Today we add BBQ pork and meatballs. His speaker is loud, so read the tickets carefully.'),vo:'na_12'},
 ],
 intro5:[
 {who:'narr',cal:['6:00',L('Ngày 5','Day 5')],tint:DAY,t:L('Ngày 5. Trời nóng như đổ lửa. Tiệm của Kevin đông khách… vì phát quà.','Day 5. Scorching hot. Kevin\'s shop is crowded… because he\'s giving out freebies.')},
 {who:'na',f:'blouse_happy',t:L('Hôm ni có nước chanh dây. Múc 2 trái, nước đường vừa vạch, lắc cho đều.','Today: passion fruit juice. Scoop 2 fruits, syrup to the line, shake well.'),vo:'na_13'},
 {who:'na',f:'blouse_happy',t:L('Còn bánh mì đặc biệt nữa: thịt nguội, chả lụa, xá xíu. Đủ ba món.','And the special bánh mì: ham, pork roll and BBQ pork. All three.'),vo:'na_14'},
 {who:'huy',f:'happy',t:L('Ba món thịt, một anh chủ đẹp trai. Đặc biệt thiệt.','Three meats, one handsome owner. Very special.'),vo:'huy_16'},
 {who:'chloe',f:'arms_up',t:L('Ba… ba…','Ba… ba…'),vo:'chloe_2'},
 {who:'huy',f:'shocked',t:L('Em! Chloe kêu "ba" kìa! Lần đầu tiên luôn!','Na! Chloe said "ba"! Her first word!'),vo:'huy_17'},
 {who:'na',f:'blouse_laughing',t:L('Con kêu bánh mì đó anh. "Bá… bánh".','She means bánh mì. "Ba… bánh".'),vo:'na_15'},{who:'huy',f:'front',t:L('Nghe nói nay có khách Tây. Anh tập rồi nè: "Wăn bánh mì, phờ-li!"','I heard a tourist is coming. I practiced: "Wan bánh mì, pli!"')},{who:'na',f:'blouse_laughing',t:L('Tiếng Anh của anh… tuyệt đối điện ảnh.','Your English is… absolutely cinematic.')},
 ],
 intro6:[
 {who:'narr',cal:['6:00',L('Ngày 6','Day 6')],tint:DAY,t:L('Ngày 6. Có tin đồn lan khắp chợ: "Bánh Mì A Huy xài pa-tê hết hạn".','Day 6. A rumor spreads: "Bánh Mì A Huy uses expired pâté".')},
 {who:'kevin',f:'happy',t:L('Ai đồn vậy ta? Hổng biết nha bro. Hehe.','Who said that? No idea, bro. Hehe.'),vo:'kevin_1'},{who:'huy',f:'angry_side',t:L('Kevin! Ông đúng là báo thủ của cả xóm!','Kevin! You\'re the menace of the whole block!')},{who:'kevin',f:'shocked',t:L('Ê ê, tui chỉ… bấm chia sẻ thôi mà bro.','Hey hey, I only… pressed share, bro.')},
 {who:'na',f:'blouse_unimpressed',t:L('Rứa thì hôm ni sai một lần là khách bỏ đi liền. Phải làm cho thiệt chuẩn.','So today, one mistake and customers walk away. Everything must be perfect.'),vo:'na_16'},
 {who:'na',f:'blouse_shocked',t:L('Mà… ba em từ Huế vô thăm. Ông khó lắm đó anh.','And… my dad is visiting from Huế today. He\'s very picky.'),vo:'na_17'},
 {who:'huy',f:'shocked',t:L('Ba vợ?! Hôm nay?!','Your dad?! Today?!'),vo:'huy_18'},
 {who:'na',f:'blouse_happy',t:L('Ừ. Ba thích bánh mì nhiều ớt, có nước mắm, với ly nước ép. Anh nhớ nha.','Yep. He likes extra chili, fish sauce, and a fresh juice. Remember that.'),vo:'na_18'},
 {who:'na',f:'blouse_happy',t:L('Hôm ni thêm nước ép trái cây. Khách chọn trái nào, bỏ đúng trái đó vô máy.','Today we add fresh juice. Use the exact fruit the customer asks for.'),vo:'na_19'},
 ],
 intro7:[
 {who:'narr',cal:['7:00',L('Ngày 7','Day 7')],tint:DAY,t:L('Ngày cuối. Cả xóm tụ tập trước tiệm. Hôm nay là Hội thi bánh mì Long Khánh.','The final day. The whole neighborhood gathers. Today is the Long Khánh Bánh Mì Contest.')},
 {who:'chu_hai',f:'front',t:L('Alô alô! Hội thi bánh mì Long Khánh bắt đầu!','Hello, hello! The Long Khánh Bánh Mì Contest begins!'),vo:'chu_hai_0'},
 {who:'chu_hai',f:'happy',t:L('Bên trái: Bánh Mì A Huy! Bên phải: Bánh Mì Sang Chảnh của Kevin!','On the left: Bánh Mì A Huy! On the right: Kevin\'s Fancy Bánh Mì!')},
 {who:'kevin',f:'happy',t:L('Chuẩn bị thua đi bro!','Get ready to lose, bro!'),vo:'kevin_0'},
 {who:'chu_hai',f:'front',t:L('Năm vòng thi, năm giám khảo. Làm nhanh, làm đúng, điểm cao!','Five rounds, five judges. Fast and correct means high scores!'),vo:'chu_hai_1'},
 {who:'na',f:'blouse_happy',t:L('Anh ơi, cố lên. Em với Chloe ở đây nè.','You can do it. Chloe and I are right here.'),vo:'na_20'},
 {who:'huy',f:'happy',t:L('Dạ, dễ ợt mà!','Easy peasy!'),vo:'huy_5'},
 ],
};

/* evening dialogue per day: function(result) -> lines */
function eveningScript(d,R){
 const m=R.money.toLocaleString('vi-VN')+'đ',rk=R.stars;
 const out=[{who:'narr',cal:['19:00',L('Tối','Evening')],tint:EVE,t:L('Tối. Dọn hàng xong, điện thoại rung…','Evening. As the stall closes, the phone buzzes…'),hide:'both'},
  {who:'call',t:L('Alô Huy hả con? Bán sao rồi con?','Hello Huy? How did it go?'),vo:'ma_0'},
  {who:'huy',f:'happy',t:L(`Dạ được ${m} má!`,`I made ${m}, Mom!`)}];
 const ma={
  1:[L('Tiệm còn đây là mừng rồi.','The stall is still standing. That\'s something.'),L('Cũng được. Má hồi đầu còn bán dở hơn.','Not bad. I did worse when I started.'),L('Ủa, giỏi vậy? Thôi má đi Đà Lạt thêm tuần nữa.','Wow, that good? Then I\'ll stay in Đà Lạt another week.')],
  2:[L('Na mà không ra quầy là sập tiệm rồi.','Without Na, the stall would have collapsed.'),L('Có vợ phụ là khác liền ha.','A wife at the counter makes all the difference.'),L('Cà phê con pha mà khách khen hả? Má không tin.','Customers praised YOUR coffee? I don\'t believe it.')],
  3:[L('Má coi live của con Mai rồi. Con mặc cái áo đó hả?','I watched Mai\'s livestream. You wore THAT shirt?'),L('Má coi live rồi. Cũng có người khen.','I watched the livestream. Some people liked it.'),L('Live của Mai lên ba trăm người coi! Má khoe cả hội rồi!','Mai\'s live hit 300 viewers! I told all my friends!')],
  4:[L('Tiệm bên kia mở loa ồn quá hả? Kệ nó.','The shop across is loud? Ignore it.'),L('Thằng Kevin đó hả? Hồi nhỏ nó ăn chịu bánh mì của má hoài.','That Kevin? As a kid he ate my bánh mì on credit all the time.'),L('Kevin hả? Hồi nhỏ nó còn nợ má 3 ổ chưa trả! Con thắng nó là phải.','Kevin? He still owes me 3 bánh mì from childhood! Of course you beat him.')],
  5:[L('Nóng quá thì nhớ uống nước nha con.','Stay hydrated in this heat.'),L('Khách Tây cũng ghé hả? Tiệm mình nổi tiếng rồi.','A foreign tourist too? We\'re famous now.'),L('Ông Tây khen hả? Má đăng lên Facebook liền!','The tourist loved it? I\'m posting it on Facebook!')],
  6:[L('Ba vợ con ghé hả? Trời ơi, má lo quá.','Your father-in-law visited? Oh, I\'m so worried.'),L('Ba của Na khen hả? Vậy là được rồi.','Na\'s dad liked it? Then you\'re fine.'),L('Ông sui khen con hả? Má yên tâm về rồi!','Your father-in-law praised you? Then I can finally relax!')],
 };
 out.push({who:'call',t:ma[d][rk]||ma[d][0],vo:'ma_eve_'+d+'_'+(ma[d][rk]?rk:0)});
 if(d===1&&R.dogStolen)out.push({who:'call',t:L('Mochi méc má là con để con Kẹo ăn trộm chả lụa hả?','Mochi says you let Kẹo steal the pork roll?'),vo:'ma_13'},{who:'huy',f:'shocked',t:L('…Con mèo đó méc má thiệt hả?!','…That cat actually snitched?!'),vo:'huy_19'});
 if(d===1)out.push(R.cobaDiscount?{who:'call',t:L('Con bớt cho cô Ba hả? Mai cô đòi bớt hai nghìn cho coi!','You gave Cô Ba a discount? Tomorrow she\'ll want 2,000 off!'),vo:'ma_14'}:{who:'call',t:L('Không bớt cho cô Ba hả? Giỏi! Giống má.','No discount for Cô Ba? Good! Just like me.'),vo:'ma_15'});
 if(d===3&&R.lotteryBought)out.push({who:'huy',f:'happy',t:L('Hôm nay con còn mua vé số của bà Sáu nữa má.','I also bought a lottery ticket from Bà Sáu.'),vo:'huy_20'},{who:'call',t:L('Mua vé số? Thôi cầu trời đi con.','A lottery ticket? Well, pray then.'),vo:'ma_16'});
 if(d===6&&R.lotteryWin)out.push({who:'huy',f:'happy',t:L('Má ơi! Vé số của bà Sáu trúng 50 nghìn!','Mom! Bà Sáu\'s lottery ticket won 50k!'),vo:'huy_21'},{who:'call',t:L('Trúng 50 nghìn mà vé 10 nghìn. Lời 40! Giỏi!','Won 50k on a 10k ticket. That\'s 40k profit! Nice!'),vo:'ma_17'});
 out.push({who:'call',t:L('Thôi má đi ăn lẩu gà lá é đây. Ngủ sớm nha con!','Okay, I\'m off for chicken hotpot. Sleep early!'),vo:'ma_4'});
 const sc=[4,6,8][rk]||4;
 out.push({who:'narr',t:L('Na ôm Chloe ngồi xuống cạnh A Huy.','Na sits down next to Huy, holding Chloe.')});
 const na={
  1:L(`Em cho anh ${sc} điểm. 1 điểm vì anh còn sống, còn lại vì tiệm còn đứng.`,`I give you ${sc} points. 1 because you survived, the rest because the stall survived.`),
  2:L(`${sc} điểm. Trừ 1 điểm vì anh làm con khóc.`,`${sc} points. Minus 1 for making the baby cry.`),
  3:L(`${sc} điểm. Lên live mà anh cười gượng quá.`,`${sc} points. You smiled way too stiffly on the livestream.`),
  4:L(`${sc} điểm. Kevin ồn rứa mà anh vẫn bán được. Em phục.`,`${sc} points. Kevin was so loud and you still sold. I\'m impressed.`),
  5:L(`${sc} điểm. Anh nói tiếng Anh rứa mà ông Tây vẫn hiểu.`,`${sc} points. Your English was… creative, and he still understood.`),
  6:L(`${sc} điểm. Ba em nói: "Thằng ni được." Ba chưa khen ai rứa hết.`,`${sc} points. My dad said: "This boy is alright." He never says that.`),
 };
 out.push({who:'na',f:'blouse_laughing',t:na[d]});
 out.push({who:'huy',f:'shocked',t:L('…Thang điểm mấy vậy em?','…Out of how many?'),vo:'huy_22'},{who:'na',f:'blouse_unimpressed',t:L('Thang 100.','Out of 100.'),vo:'na_21'});
 if(d===6)out.push({who:'chu_hai',f:'front',t:L('Alô! Thông báo: ngày mai tổ chức Hội thi bánh mì Long Khánh! Bánh Mì A Huy gặp Bánh Mì Sang Chảnh!','Announcement: tomorrow is the Long Khánh Bánh Mì Contest! Bánh Mì A Huy versus Fancy Bánh Mì!'),vo:'chu_hai_0'},{who:'huy',f:'shocked',t:L('…Hội thi gì?!','…What contest?!'),vo:'huy_23'});
 return out}

/* contest */
const CONTEST=[
 {judge:'co_ba',o:{r:'thit_nguoi',chili:1},line:L('Làm cho cô ổ thịt nguội. Ngon thì cô cho điểm cao… và hông đòi bớt.','Make me a cold-cut. If it\'s good, I\'ll score high… and won\'t ask for a discount.')},
 {judge:'anh_tuan',o:{r:'xa_xiu',chili:1,sauce:'chili'},line:L('Hôm nay… anh muốn thử ớt. Nhiều ớt.','Today… I want to try chili. Lots of chili.')},
 {judge:'tom',o:{r:'dac_biet',noCilantro:1,drink:'chanh_day'},line:L('Special one please! No cilantro!','Special one please! No cilantro!')},
 {judge:'ong_thanh',o:{r:'dac_biet',chili:1,sauce:'fish',drink:'tra_dao'},line:L('Bánh mì đặc biệt, nhiều ớt, nước mắm. Với ly trà đào.','Special bánh mì, extra chili, fish sauce. And a peach tea.')},
 {judge:'ma',o:{r:'cha_lua',drink:'cafe'},line:L('Ổ chả lụa với ly cà phê. Như má làm.','A pork-roll bánh mì and a coffee. Just like I make it.')},
];
const CONTEST_END={
 win:[
 {who:'chu_hai',f:'happy',t:L('Kết quả đã có! Người chiến thắng là… Bánh Mì A Huy!','The results are in! The winner is… Bánh Mì A Huy!'),vo:'chu_hai_4'},
 {who:'kevin',f:'shocked',t:L('Không thể nào! Sao tui thua được?','Impossible! How did I lose?'),vo:'kevin_2'},
 {who:'kevin',f:'eating',t:L('…Để tui thử một miếng coi. …Ờ. Cũng được. Hơi ngon.','…Let me try a bite. …Okay. It\'s… pretty good.'),vo:'kevin_3'},
 {who:'ma',f:'happy',t:L('Ổ này ngon hơn má làm đó con.','This is better than mine, son.'),vo:'ma_18'},
 {who:'huy',f:'shocked',t:L('MÁ?! Má về hồi nào vậy?!','MOM?! When did you get back?!'),vo:'huy_24'},
 {who:'ma',f:'happy',t:L('Từ vòng 1. Má đứng sau lưng con nãy giờ.','Since round 1. I\'ve been standing behind you the whole time.'),vo:'ma_19'},
 {who:'na',f:'blouse_laughing',t:L('Lần đầu tiên em cho anh 10 điểm. Thang 10 nha.','For the first time, I give you 10 points. Out of 10.'),vo:'na_3'},
 {who:'chloe',f:'arms_up',t:L('Ba… ba!','Ba… ba!'),vo:'chloe_2'},
 {who:'huy',f:'happy',t:L('Lần này là "ba" thiệt đó em!','That one was really "ba"!'),vo:'huy_25'},
 {who:'narr',tint:EVE,t:L('Từ hôm đó, tấm bảng hiệu được đổi tên. "Bánh Mì A Huy" — của Má Lan, Na, Chloe… và cả xóm.','From that day on, the sign was renamed: "Bánh Mì A Huy" — belonging to Mom Lan, Na, Chloe… and the whole neighborhood.')},
 {who:'narr',t:L('HẾT. Cảm ơn bạn đã chơi! — Mike Do X Claude','THE END. Thanks for playing! — Mike Do X Claude')},
 ],
 lose:[
 {who:'chu_hai',f:'front',t:L('Kết quả… Bánh Mì Sang Chảnh thắng sát nút!','Results… Fancy Bánh Mì wins by a hair!'),vo:'chu_hai_4'},
 {who:'kevin',f:'happy',t:L('Old school thua rồi bro!','Old school loses, bro!'),vo:'kevin_1'},
 {who:'tom',f:'eating',t:L('But… I liked Huy\'s better.','But… I liked Huy\'s better.'),vo:'tom_5'},
 {who:'ma',f:'happy',t:L('Thua thì sao. Khách quen vẫn ở đây hết nè con.','So what if you lost? All our regulars are still here.'),vo:'ma_20'},
 {who:'huy',f:'shocked',t:L('Má?! Má về hồi nào?','Mom?! When did you get back?'),vo:'huy_26'},
 {who:'na',f:'blouse_happy',t:L('Em vẫn cho anh 9 điểm. Thang 10. Mai mình thi lại.','I still give you 9. Out of 10. We\'ll try again.'),vo:'na_22'},
 {who:'narr',t:L('Hội thi có thể chơi lại để giành chiến thắng. — Mike Do X Claude','You can replay the contest to win. — Mike Do X Claude')},
 ],
};
