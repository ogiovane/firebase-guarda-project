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
        title: 'Default',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'elements',
    title: 'Cautelas',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'cadastro-militar',
        title: 'Cadastrar Militar',
        type: 'item',
        classes: 'nav-item',
        url: '/cadastro-militar',
        icon: 'ti ti-user-plus'
      },
      {
        id: 'cadastro-material',
        title: 'Cadastrar Material',
        type: 'item',
        classes: 'nav-item',
        url: '/cadastro-material',
        icon: 'ti ti-circle-plus'
      },
      {
        id: 'cautelas',
        title: 'Cautelar Material',
        type: 'item',
        classes: 'nav-item',
        url: '/cautelar-material',
        icon: 'ti ti-shopping-cart'
      },
      {
        id: 'listar-materiais',
        title: 'Listar Materiais',
        type: 'item',
        classes: 'nav-item',
        url: '/listar-materiais',
        icon: 'ti ti-list'
      },
      {
        id: 'color',
        title: 'Materiais Cautelados',
        type: 'item',
        classes: 'nav-item',
        url: 'materiais-cautelados',
        icon: 'ti ti-brush'
      },
      // {
      //   id: 'tabler',
      //   title: 'Tabler',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'https://tabler-icons.io/',
      //   icon: 'ti ti-leaf',
      //   target: true,
      //   external: true
      // }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'login',
        title: 'Login',
        type: 'item',
        classes: 'nav-item',
        url: '/login',
        icon: 'ti ti-login',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Register',
        type: 'item',
        classes: 'nav-item',
        url: '/register',
        icon: 'ti ti-user-plus',
        target: true,
        breadcrumbs: false
      }
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
        url: '/relatorio',
        classes: 'nav-item',
        icon: 'ti ti-report'
      }
    ]
  }
];
