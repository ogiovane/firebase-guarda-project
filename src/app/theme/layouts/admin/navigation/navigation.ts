export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Início',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/dashboard',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'cautelas',
    title: 'Cautelas',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'cautelas',
        title: 'Cautelar Material',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/cautelar-material',
        icon: 'ti ti-shopping-cart'
      },
      {
        id: 'color',
        title: 'Materiais Cautelados',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/materiais-cautelados',
        icon: 'ti ti-list'
      },
    ]
  },
  {
    id: 'elements',
    title: 'Materiais',
    type: 'group',
    icon: 'icon-navigation',
    children: [


      {
        id: 'cadastro-material',
        title: 'Cadastrar Material',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/cadastro-material',
        icon: 'ti ti-circle-plus'
      },
      {
        id: 'listar-materiais',
        title: 'Listar Materiais',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/listar-materiais',
        icon: 'ti ti-list'
      },


    ]
  },
  {
    id: 'authentication',
    title: 'Cadastros',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'cadastro-militar',
        title: 'Cadastrar Militar',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/cadastro-militar',
        icon: 'ti ti-user-plus'
      },

      {
        id: 'tabler',
        title: 'Listar Cadastros',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/lista-cadastros',
        icon: 'ti ti-list',
        // target: true,
        // external: true
      }
      // {
      //   id: 'login',
      //   title: 'Login',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/login',
      //   icon: 'ti ti-login',
      //   target: true,
      //   breadcrumbs: false
      // },
      // {
      //   id: 'register',
      //   title: 'Register',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/register',
      //   icon: 'ti ti-user-plus',
      //   target: true,
      //   breadcrumbs: false
      // }
    ]
  },
  {
    id: 'other',
    title: 'Relatório',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sample-page',
        title: 'Emitir relatório',
        type: 'item',
        url: '/admin/relatorio',
        classes: 'nav-item',
        icon: 'ti ti-report'
      },
      {
        id: 'sample-page',
        title: 'Histórico Cautelas',
        type: 'item',
        url: '/admin/historico-cautelas',
        classes: 'nav-item',
        icon: 'ti ti-report'
      },
    ]
  }
];
