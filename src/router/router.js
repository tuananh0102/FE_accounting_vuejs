import { createRouter, createWebHashHistory } from "vue-router";

import EmployeeList from "@/pages/employee/EmployeeList";
import MoneyList from "@/pages/money/MoneyList";
import ProcessMoney from "@/pages/money/ProcessMoney";
import BaseMoney from "@/pages/money/BaseMoney";
import AppList from "@/pages/app/AppList";
import AccountList from "@/pages/account/AccountList";
import ProviderList from "@/pages/provider/ProviderList";
import PaymentDetail from "@/pages/money/PaymentDetail";

const routes = [
  {
    path: "/money",
    component: BaseMoney,
    name: "ProcessRouter",
    children: [
      {
        path: "",
        component: ProcessMoney,
        name: "ProcessMoney",
      },
      {
        path: "moneyList",
        component: MoneyList,
        name: "MoneyList",
      },
    ],
  },
  {
    path: "/apps",
    component: AppList,
    name: "AppListRouter",
  },

  {
    path: "/paymentDetail",
    component: PaymentDetail,

    name: "PaymentDetail",
  },
  {
    path: "/apps/employees",
    component: EmployeeList,
    name: "EmployeeListRouter",
  },
  { path: "/apps/providers", component: ProviderList, name: "ProviderList" },
  { path: "/apps/accounts", component: AccountList, name: "AccountList" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
