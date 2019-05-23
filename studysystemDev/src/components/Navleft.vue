/** * 左边菜单 */
<template>
  <el-aside :class="newClass">
    <div class="sidebar">
      <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#1AA094"
        unique-opened
        router
      >
        <template v-for="item in loadList">
          <template v-if="item.subMenu">
            <template>
              <el-submenu :index="'menu_'+item.id" :key="'menu_'+item.id">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title" class="mintitle">{{ item.menuName }}</span>
                </template>
                <el-menu-item
                  class="smintitle"
                  v-for="subItem in item.subMenu"
                  :key="subItem.id"
                  :index="'menu_'+subItem.id"
                  :route="{ path:subItem.url,query:{id:subItem.id,title:subItem.menuName}}"
                >{{ subItem.menuName }}</el-menu-item>
              </el-submenu>
            </template>
          </template>
          <template v-else>
            <el-menu-item
              :index="'menu_'+item.id"
              :route="{ path:item.url,query:{lanmuId:item.id,title:item.menuName}}"
              :key="item.id"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </el-aside>
</template>
<script>
import bus from "../api/bus.js";

export default {
  name: "Navleft",
  data() {
    return {
      collapse: false,
      loadList: [],
      getList: [
        {
          id: 1,
          icon: "el-icon-message",
          title: "系统消息",
          menuName: "系统消息",
          subMenu: [
            {
              id: 2,
              menuName: "消息提示",
              title: "消息提示",
              url: "/warnmessage" //跳转路径
            },
            {
              id: 3,
              menuName: "查看留言",
              title: "查看留言",
              url: "/leavemessage" //跳转路径
            }
          ]
        },
        {
          id: 4,
          icon: "el-icon-news", //图标
          menuName: "用户管理",
          // title: "实验教学管理",
          subMenu: [
            {
              id: 5,
              // icon: "el-icon-setting", //图标
              menuName: "学生管理",
              title: "学生管理",
              url: "/studentmanage" //跳转路径
            },
            {
              id: 6,
              // icon: "el-icon-setting", //图标
              menuName: "教职工管理",
              title: "教职工管理",
              url: "/usermanage" //跳转路径
            }
          ]
        },
        {
          id: 7,
          icon: "el-icon-date", //图标
          menuName: "教学管理",
          // title: "实验教学管理",
          subMenu: [
            {
              id: 8,
              menuName: "学生选课",
              title: "学生选课",
              url: "/electivecourse" //跳转路径
            },
            {
              id: 9,
              menuName: "实验任务",
              title: "实验任务",
              url: "/task" //跳转路径
            }
          ]
        },
        {
          id: 10,
          icon: "el-icon-view", //图标
          menuName: "查看课表",
          // title: "实验教学管理",
          subMenu: [
            {
              id: 11,
              menuName: "学生课表",
              title: "学生课表",
              url: "/studentcurriculum" //跳转路径
            },
            {
              id: 12,
              menuName: "教职工课表",
              title: "教职工课表",
              url: "/curriculum" //跳转路径
            }
          ]
        },
        {
          id: 13,
          icon: "el-icon-document", //图标
          menuName: "成绩管理",
          // title: "实验教学管理",
          subMenu: [
            {
              id: 14,
              menuName: "查看成绩",
              title: "查看成绩",
              url: "/grade" //跳转路径
            },
            {
              id: 15,
              menuName: "统计成绩",
              title: "统计成绩",
              url: "/setgrade" //跳转路径
            }
          ]
        },
        {
          id: 16,
          icon: "el-icon-setting", //图标
          menuName: "系统管理",
          // title: "用户管理",
          // url: "/usermanage" //跳转路径
          subMenu: [
            {
              id: 17,
              // icon: "el-icon-date", //图标
              menuName: "课程管理",
              title: "课程管理",
              url: "/classmanage" //跳转路径
            },
            {
              id: 18,
              // icon: "el-icon-date", //图标
              menuName: "课表管理",
              title: "课表管理",
              url: "/curriculummanage" //跳转路径
            },
            {
              id: 19,
              // icon: "el-icon-date", //图标
              menuName: "实验室资源管理",
              title: "实验室资源管理",
              url: "/laboratoryResources" //跳转路径
            }
          ]
        }
      ],
      newClass: "newAside"
    };
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
      if (this.collapse) {
        setTimeout(() => {
          this.newClass = "newMinaside";
        }, 300);
      } else {
        this.newClass = "newAside";
      }
    });
    bus.$on("menus", menus => {
      this.items = menus;
    });
  },
  mounted() {
    this.getmenu();
  },
  methods: {
      getmenu() {
        var url = "/about/getLoad";
        var data = {type: sessionStorage.getItem("type")};
        this.$post(url, data).then(res => {
          this.loadList = res.dataList;
        });
      },
    toggle(showtype) {
      this.collapsed = !showtype;
      this.$emit("toggle", this.collapsed);
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>
<style scoped>
.newAside {
  width: 250px !important;
}
.newMinaside {
  width: 64px !important;
}
.el-submenu__title i {
  margin-left: 0px;
  /* position: absolute; */
}
.el-submenu {
  text-align: left;
}
.mintitle {
  /* margin-left: 25px; */
  font-size: 14px;
}
.smintitle {
  font-size: 10px;
  margin-left: 10px;
}
.el-menu-item {
	text-align: left;
}

.el-menu-item span {
	margin-left: 10px;
}
.el-menu-item > a {
  color: #fff;
}
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
/* .el-aside::not(.el-aside--collapse){
	width:250px !important; 
} */
.sidebar > ul {
  height: 100%;
}
</style>