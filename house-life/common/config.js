// 全局配置文件
// let baseUrl = 'http://192.168.3.110:8088';
// let staticUrl = 'http://192.168.3.110:8088';
// let baseUrl = 'https://6b80e893.r19.cpolar.top';
// let staticUrl = 'https://6b80e893.r19.cpolar.top';
let baseUrl = 'https://www.51mzp.com';
let staticUrl = 'https://www.51mzp.com';
// 版本号 用于更新
let version = 1;
// vuex_version版本号 用于显示
let vuex_version = '1.0.' + version;
// 是否需要热更新（后台自动更新）
let flag_hot = false;
let web_prefix = "/web_api"
// let web_prefix = ""

export default {
	baseUrl: baseUrl,
	staticUrl:staticUrl,
	version: version,
	vuex_version: vuex_version,
	web_prefix: web_prefix,
}

