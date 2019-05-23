import Vue from "vue";
import Router from "vue-router";
//import store from './store.js';
import Main from "./views/Main";
import Login from "./views/Login";
import Index from "./views/Index";
import test from "./test.vue"
import Usermanage from "./views/Usermanagement/Usermanage";
import Studentmanage from "./views/Usermanagement/Studentmanage";
import Curriculummanage from "./views/SystemManagement/Curriculummanage";
import laboratoryResources from "./views/SystemManagement/laboratoryResources";
import Classmanage from "./views/SystemManagement/Classmanage";
import Electivecourse from "./views/Teachmanagement/Electivecourse";
import Task from "./views/Teachmanagement/Task";
import Curriculum from "./views/Viewschedule/Curriculum";
import Studentcurriculum from "./views/Viewschedule/Studentcurriculum";
import Grade from "./views/Grademanagement/Grade";
import setgrade from "./views/Grademanagement/Setgrade";
import warnmessage from "./views/Information/Warnmessage";
import leavemessage from "./views/Information/Leavemessage";
Vue.use(Router);
const router = new Router({
  // mode:'history',
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/test",
      name: "test",
      component: test
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/main",
      name: "Main",
      component: Main,
      children: [
        {
          path: "/",
          component: Index, //首页
          meta: {
            title: "首页"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/electivecourse",
          component: Electivecourse, //学生选课
          meta: {
            title: "学生选课"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/studentcurriculum",
          component: Studentcurriculum, //个人课表
          meta: {
            title: "学生课表"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/curriculum",
          component: Curriculum, //个人课表
          meta: {
            title: "教职工课表"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/task",
          component: Task, //查看实验任务
          meta: {
            title: "查看实验任务"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/warnmessage",
          component: warnmessage, //查看成绩
          meta: {
            title: "消息提示"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/leavemessage",
          component: leavemessage, //查看成绩
          meta: {
            title: "查看留言"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/setgrade",
          component: setgrade, //查看成绩
          meta: {
            title: "统计成绩"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/grade",
          component: Grade, //查看成绩
          meta: {
            title: "查看成绩"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/studentmanage",
          component: Studentmanage, //用户管理
          meta: {
            title: "学生管理"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/usermanage",
          component: Usermanage, //用户管理
          meta: {
            title: "教职工管理"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/classmanage",
          component: Classmanage, //课表
          meta: {
            title: "课程管理"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/curriculummanage",
          component: Curriculummanage, //课表
          meta: {
            title: "课表管理"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          path: "/laboratoryResources",
          component: laboratoryResources, //实验室资源
          meta: {
            title: "实验室资源管理"
            //								requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        }
      ]
    }
    //		{
    //			path: '*',
    //			name: '404',
    //			component: errHtml
    //		}
  ]
});

//当路由进入前
//router.beforeEach((to, from, next) => {
//	if(to.path === '/') {
//		next()
//	} else {
//		if(sessionStorage.getItem("Authorization")) { //false表示没登陆，true表示登陆
//			// 每次切换页面时，调用进度条
//			NProgress.start();
//			// 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
//			next()
//		} else {
//			next('/')
//		}
//	}
//
//});
//当路由进入后：关闭进度条
//router.afterEach(() => {
//	// 在即将进入新的页面组件前，关闭掉进度条
//	NProgress.done()
//})
////组件加载进度条
//NProgress.configure({
//	easing: 'ease', // 动画方式
//	speed: 500, // 递增进度条的速度
//	showSpinner: false, // 是否显示加载ico
//	trickleSpeed: 200, // 自动递增间隔
//	minimum: 0.3 // 初始化时的最小百分比
//})
export default router;
