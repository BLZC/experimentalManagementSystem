<template>
	<el-container class="index-con" id="app1">
		<navTop></navTop> <!--头部组件-->
		<el-container class="main-con">
			<navLeft></navLeft> <!--左侧列表组件-->
			<el-main :class="{'content-collapse':collapse}">
				<v-tags></v-tags> <!--标签页组件-->
				<div class="content">
					<transition name="move" mode="out-in">
						<keep-alive :include="tagsList">
							<router-view ></router-view>
						</keep-alive>
					</transition>

					<el-row type="flex" justify="center"></el-row>
				</div>
			</el-main>
		</el-container>
		<el-footer>南京邮电大学实验室管理系统</el-footer>
	</el-container>
</template>
<script>
	import navTop from "../components/Navtop.vue";
	import navLeft from "../components/Navleft.vue";
	import vTags from "../components/Tags.vue";
	import bus from "../api/bus.js";
	export default {
		name: 'Main',
		data() {
			return {
				tagsList: [],
				collapse: false,
				loading: true
			};
		},
		components: {
			navTop,
			navLeft,
			vTags
		},
		created() {
			bus.$on("collapse", msg => {   //接收标签页关闭事件
				this.collapse = msg;
			});

			// 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
			bus.$on("tags", msg => {
				let arr = [];
				for(let i = 0, len = msg.length; i < len; i++) {
					msg[i].name && arr.push(msg[i].name);
				}
				this.tagsList = arr;
			});
		},
		mounted() {
			this.Init();
		},
		methods: {
			Init() {
				let h = document.documentElement.clientHeight; //可见区域高度
				let app1 = document.getElementById("app1");
				app1.style.height = h + "px";
			},
			removeTab(targetName) {       //删除标签页
				let tabs = this.editableTabs2;
				let activeName = this.editableTabsValue2;
				if(activeName === targetName) {
					tabs.forEach((tab, index) => {
						if(tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if(nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}
				this.editableTabsValue2 = activeName;
				this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
			}
		}
	};
</script>
<style scoped>
	.el-footer {
		height: 40px !important;
		background-color: #fafafa;
		color: #333;
		text-align: center;
	}
	
	.el-footer {
		line-height: 40px;
	}
	
	.el-main {
		background-color: #fff;
		color: #333;
		text-align: center;
	}
	
	body>.el-container {
		margin-bottom: 40px;
	}
	
	.index-con {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}
</style>