export const PAGE_STATUS = {
	loading: -1, // 加载
	empty: 0, // 数据空
	error: 1, // 异常报错
	noright: 2, // 没有操作权限，没有授权
	nonetwork: 3, // 没有网络,接口请求失败
	normal: 4, // 正常操作
}