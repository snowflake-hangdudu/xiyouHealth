import AntIcon from '@/assets/icons'

export const router = {
  account: {
    path: 'account',
    component: () => import('@/part-tooth/pages/account-manage/index.vue'),
    name: 'account',
    meta: {
      title: '账户管理',
      icon: AntIcon.key,
      roles: ['admin'],
      noCache: true,
      affix: false
    }
  },
  apply: {
    path: 'apply',
    component: () => import('@/part-tooth/pages/apply-manage/index.vue'),
    name: 'apply',
    meta: {
      title: '申请审核',
      icon: AntIcon.picRight,
      roles: ['doctor'],
      noCache: true,
      affix: true
    }
  },
  doctor: {
    path: 'doctor',
    component: () => import('@/part-tooth/pages/doctor-manage/index.vue'),
    name: 'doctor',
    meta: {
      title: '医生管理',
      icon: AntIcon.reconciliation,
      roles: ['store'],
      noCache: true,
      affix: true
    }
  },
  order: {
    path: 'order',
    component: () => import('@/part-tooth/pages/order-manage/index.vue'),
    name: 'order',
    meta: {
      title: '订单管理',
      icon: AntIcon.unorderedList,
      roles: ['store', 'drug'],
      noCache: true,
      affix: true
    }
  },
  prescription: {
    path: 'prescription',
    component: () => import('@/part-tooth/pages/prescription-manage/index.vue'),
    name: 'prescription',
    meta: {
      title: '处方审核',
      icon: AntIcon.solution,
      roles: ['pharmacist'],
      noCache: true,
      affix: true
    }
  },
  family: {
    path: 'user-family',
    component: () => import('@/part-tooth/pages/user-family-manage/index.vue'),
    name: 'family',
    meta: {
      title: '患者管理',
      icon: AntIcon.team,
      roles: ['store'],
      noCache: true,
      affix: false
    }
  }
}
