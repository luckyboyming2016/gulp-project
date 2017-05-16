define({
	selector:{
		/*'.region-list .item > a':{
			name:'找房条件：行政区',
			page:'finder'
		},
		'.region-list .row-expand a':{
			name:'找房条件：商圈',
			page:'finder'
		},*/
		'.body-tiny:not(".expand-map") .region-list  a':{
			name:'找房条件：区域',
			page:'finder',
			id:'T_0001'
		},
		'.expand-map .region-list a':{
			name:'找房条件(地图)：区域',
			page:'finder',
			id:'P_0025'
		},
		
		/*'.subway-list .item > a':{
			name:'找房条件：地铁线',
			page:'finder'
		},
		'.subway-list .row-expand a':{
			name:'找房条件：地铁站',
			page:'finder'
		},*/
		'.body-tiny:not(".expand-map") .subway-list a':{
			name:'找房条件：地铁',
			page:'finder',
			id:'T_0002'
		},
		'.expand-map .subway-list a':{
			name:'找房条件(地图):地铁',
			page:'finder',
			id:'P_0024'
		},
		
		'.body-tiny:not(".expand-map") .panel-filter .list a[type=rentType]':{
			name:'找房条件：租房类型',
			page:'finder',
			id:'T_0003'
		},
		'.expand-map .panel-filter .list a[type=rentType]':{
			name:'找房条件(地图)：租房类型',
			page:'finder',
			id:'T_0026'
		},
		
		'.body-tiny:not(".expand-map") .panel-filter .list a[type=brand]':{
			name:'找房条件：品牌',
			page:'finder',
			id:'T_0004'
		},
		'.expand-map .panel-filter .list a[type=brand]':{
			name:'找房条件(地图)：品牌',
			page:'finder',
			id:'T_0027'
		},
		
		/*'.panel-filter .list a[type=level]':{
			name:'找房条件：品质',
			page:'finder'
		},*/
		
		'.body-tiny:not(".expand-map") #paramPrice':{
			name:'找房条件：价格',
			page:'finder',
			id:'T_0005'
		},
		'.expand-map #paramPrice':{
			name:'找房条件(地图)：价格',
			page:'finder',
			id:'T_0035'
		},
		
		'.body-tiny:not(".expand-map") .panel-filter .list a[type=roomMate]':{
			name:'找房条件：室友',
			page:'finder',
			id:'T_0006'
		},
		'.expand-map .panel-filter .list a[type=roomMate]':{
			name:'找房条件(地图)：室友',
			page:'finder',
			id:'T_0029'
		},
		
		/*'#xingzuo-dom a':{
			name:'找房条件：星座',
			page:'finder'
		},*/
		
		'.expand-map #xingzuo-dom a':{
			name:'找房条件(地图)：星座',
			page:'finder',
			id:'T_0030'
		},
		
		'.body-tiny:not(".expand-map")  #ruzhu-dom a':{
			name:'找房条件：可入住状态',
			page:'finder',
			id:'T_0007'
		},
		
		'.expand-map #ruzhu-dom a':{
			name:'找房条件(地图)：可入住状态',
			page:'finder',
			id:'T_0031'
		},
		
		'.body-tiny:not(".expand-map") #huxing-dom a':{
			name:'找房条件：户型',
			page:'finder',
			id:'T_0008'
		},
		
		'.expand-map  #huxing-dom a':{
			name:'找房条件(地图）:户型',
			page:'finder',
			id:'T_0032'
		},
		
		'.body-tiny:not(".expand-map") #fangyuan-dom a':{
			name:'找房条件：房源类型',
			page:'finder',
			id:'T_0009'
		},
		'.expand-map #fangyuan-dom a':{
			name:'找房条件(地图)：房源类型',
			page:'finder',
			id:'T_0033'
		},
		
		'.body-tiny:not(".expand-map") #chaoxiang-dom a':{
			name:'找房条件：朝向',
			page:'finder',
			id:'T_0010'
		},
		'.expand-map #chaoxiang-dom a':{
			name:'找房条件(地图)：朝向',
			page:'finder',
			id:'T_0034'
		},
		
		'.body-tiny:not(".expand-map") .panel-filter .mock-radio[type=toilet]':{
			name:'找房条件：独卫',
			page:'finder',
			id:'T_0011'
		},
		'.expand-map .panel-filter .mock-radio[type=toilet]':{
			name:'找房条件(地图)：独卫',
			page:'finder',
			id:'T_0036'
		},
		
		'.body-tiny:not(".expand-map") .panel-filter .mock-radio[type=veranda]':{
			name:'找房条件：阳台',
			page:'finder',
			id:'T_0012'
		},
		'.expand-map .panel-filter .mock-radio[type=veranda]':{
			name:'找房条件(地图)：阳台',
			page:'finder',
			id:'T_0037'
		},
		
		'.body-tiny:not(".expand-map") .panel-filter .mock-radio[type=airCond]':{
			name:'找房条件：空调',
			page:'finder',
			id:'T_0013'
		},
		'.expand-map .panel-filter .mock-radio[type=airCond]':{
			name:'找房条件(地图)：空调',
			page:'finder',
			id:'T_0038'
		},
		
		'.body-tiny:not(".expand-map") .panel-filter .mock-radio[type=hasPic]':{
			name:'找房条件：有照片',
			page:'finder',
			id:'T_0014'
		},
		'.expand-map .panel-filter .mock-radio[type=hasPic]':{
			name:'找房条件(地图)：有照片',
			page:'finder',
			id:'T_0039'
		},
		
		'.clearParams':{
			name:'找房清除全部条件',
			page:'finder'
		},
		'.sorting-list .sort-default':{
			name:'找房页排序：推荐',
			page:'finder',
			id:'P_0015'
		},
		'.sorting-list .sort-newly':{
			name:'找房页排序：最新发布',
			page:'finder',
			id:'P_0016'
		},
		'.sorting-list .sort-by-price':{
			name:'找房页排序：价格',
			page:'finder',
			id:'P_0017'
		},
		'.sorting-list .sort-by-area':{
			name:'找房页排序：面积',
			page:'finder',
			id:'P_0018'
		},
		'.selectParams .closeParam':{
			name:function(target){
				var typeMap = {
					district:'行政区',
					busiArea:'商圈',
					subway:'地铁线',
					station:'地铁站',
					rentType:'方式',
					brand:'品牌',
					level:'品质',
					roomMate:'室友',
					constellation:'星座',
					readyDate:'可入往状态',
					houseType:'户型',
					sourceType:'房源类型',
					orientation:'朝向',
					toilet:'独卫',
					veranda:'阳台',
					airCond:'空调',
					hasPic:'有照片',
					price:'价格'
				};
				var type = $(target).closest('.item').attr('type'); 
				return '找房清除条件：'+(typeMap[type]||type);
			},
			page:'finder'
		},
		'.recommend-swiper a':{
			name:'找房页品牌栏',
			page:'finder',
			id:'P_0019'
		},
		'.body-tiny:not(".expand-map") .room-list a':{
			name:'找房页房源列表',
			page:'finder',
			id:'P_0020'
		},
		'.expand-map .room-list a':{
			name:'找房页房源列表(地图)',
			page:'finder',
			id:'P_0040'
		},
		
		/*'.pagination a':{
			name:'找房页翻页按钮',
			page:'finder'
		},*/
		/*'.map-control-tag':{
			name:'找房页侧边模式切换按钮',
			page:'finder'
		},*/
		'.map-control-switch .reduce':{
			name:'找房页切换到列表模式',
			page:'finder',
			id:'P_0021'
		},
		'.map-control-switch .enlarge':{
			name:'找房页切换到全屏模式',
			page:'finder',
			id:'P_0022'
		},		
		
		/*'.marker-region':{
			name:'找房页地图行政区图标',
			page:'finder'
		},
		'.marker:not(".marker-region")':{
			name:'找房页地图小区图标',
			page:'finder'
		},
		'.BMap_ZoomOut,.BMap_ZoomIn':{
			name:'找房页地图缩放按钮',
			page:'finder'
		}*/
	},
	enter:{
		'.expand-map .my-search':{
			name:'找房页地图模式搜索',
			page:'finder',
			id:'P_0023'
		}
	}
});