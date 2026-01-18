// 全局配置文件
// let baseUrl = 'http://192.168.3.110:8088';
// let staticUrl = 'http://192.168.3.110:8088';

// let baseUrl = 'https://www.51mzp.com';
// let staticUrl = 'https://www.51mzp.com';
// let web_prefix = "/web-api"
// 版本号 用于更新
let version = 1;
// vuex_version版本号 用于显示
let vuex_version = '1.0.' + version;
// 是否需要热更新（后台自动更新）
let flag_hot = false;

//source-vue
// let baseUrl = 'https://64d65c76.r32.cpolar.top';
// let staticUrl = 'https://64d65c76.r32.cpolar.top';
// let web_prefix = ""
// let static_urls = {
// 	server: "source-vue",
// 	infoType_list: "/api/infoTypeApi/findInfoTypeList",
// 	infoType_queryById: "/infotype/infoType/queryById",
// 	infoType_add: "/infotype/infoType/add",
// 	infoType_edit: "/infotype/infoType/edit",
// 	info_add: '/api/infoApi/addInfo',
// 	info_list: '/api/infoApi/findInfoList',
// 	 info_findInfoById: '/api/infoApi/findInfoById',
// 	 uploadInfoImage: '/api/infoApi/uploadInfoImage',
// 	 findHouseRoomList: '/api/houseApi/findHouseRoomList',
// 	 findVillageList: '/api/houseApi/findVillageList',
// 	 addHouse: 'api/houseApi/saveHouse',
// 	 updateHouse: 'api/houseApi/updateHouse',
// 	 findHouseById: 'api/houseApi/findHouseById',
// 	 addHouseHeart: 'api/houseApi/saveHeart',
// 	updateHouseHeart: '/houseHeart/houseHeart/edit',
// 	listHouseHeart: '/houseHeart/houseHeart/list',
// 	queryHouseHeartById: '/houseHeart/houseHeart/queryById',
//     selectHouseHeart: '/api/houseApi/selectHouseHeart',
//  findHouseHeartList: '/api/houseApi/findHouseHeartList',
// }


//jeecgboot
// let baseUrl = 'http://192.168.3.110:8080/jeecg-boot';
// let staticUrl = 'http://192.168.3.110:8080/jeecg-boot';
let baseUrl = 'https://www.51mzp.com/jeecgboot';
let staticUrl = 'https://www.51mzp.com/jeecgboot';
let web_prefix = ""
let static_urls = {
	server: "jeecgboot",
	infoType_list: "/infotype/infoType/list",
	infoType_queryById: "/infotype/infoType/queryById",
	infoType_add: "/infotype/infoType/add",
	infoType_edit: "/infotype/infoType/edit",
	info_list: '/info/info/list',
	info_add: '/info/info/add',
	info_edit: '/info/info/edit',
	info_findInfoById: '/info/info/queryById',
	uploadInfoImage: '/sys/common/upload',
	findHouseRoomList: '/room/houseRoom/list',
	findVillageList: '/village/houseVillage/list',
	addHouse: '/room/houseRoom/add',
	updateHouse: '/room/houseRoom/edit',
	findHouseById: '/room/houseRoom/queryById',
	addHouseHeart: '/houseHeart/houseHeart/add',
	updateHouseHeart: '/houseHeart/houseHeart/edit',
	listHouseHeart: '/houseHeart/houseHeart/list',
	findHouseHeartList: '/houseHeart/houseHeart/queryUserHeartHouses',
	selectHouseHeart: '/houseHeart/houseHeart/list',
	queryHouseHeartById: '/houseHeart/houseHeart/queryById',
	listTown: '/town/town/list',
}

export default {
	baseUrl: baseUrl,
	staticUrl:staticUrl,
	version: version,
	vuex_version: vuex_version,
	web_prefix: web_prefix,
	static_urls: static_urls,
}

