import { Injectable } from '@angular/core';
import { authenticationEnum } from 'src/app/guards/auth.enum';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Home_Dashboard,
  },
  {
    state: 'privileges',
    childState: 'system-privileges',
    name: 'System Privileges',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Home_Dashboard,
  },
  {
    state: 'privileges',
    childState: 'privilege-groups',
    name: 'Privilege Groups',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Home_Dashboard,
  },
  {
    state: 'pages',
    childState: 'registration',
    innerChildState: 'employee',
    name: 'Employee',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Test,
  },
  {
    state: 'pages',
    childState: 'registration',
    innerChildState: 'item',
    name: 'Item Registration',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Test,
  },
  {
    state: 'pages',
    childState: 'formDemo',
    name: 'Form Demo',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Home_Dashboard,
  },
  {
    state: 'pages',
    childState: 'registration',
    innerChildState: 'grn',
    name: 'GRN',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Home_Dashboard,
  },
  {
    state: 'pages',
    childState: 'empList',
    name: 'Static Report - Emp List',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Home_Dashboard,
  },
  {
    state: 'button',
    type: 'link',
    name: 'Buttons',
    icon: 'crop_7_5',
    isVisible: false,
  },
  {
    state: 'grid',
    type: 'link',
    name: 'Grid List',
    icon: 'view_comfy',
    isVisible: false,
  },
  {
    state: 'lists',
    type: 'link',
    name: 'Lists',
    icon: 'view_list',
    isVisible: false,
  },
  {
    state: 'menu',
    type: 'link',
    name: 'Menu',
    icon: 'view_headline',
    isVisible: false,
  },
  { state: 'tabs', type: 'link', name: 'Tabs', icon: 'tab', isVisible: false },
  {
    state: 'stepper',
    type: 'link',
    name: 'Stepper',
    icon: 'web',
    isVisible: false,
  },
  {
    state: 'expansion',
    type: 'link',
    name: 'Expansion Panel',
    icon: 'vertical_align_center',
    isVisible: false,
  },
  {
    state: 'chips',
    type: 'link',
    name: 'Chips',
    icon: 'vignette',
    isVisible: false,
  },
  {
    state: 'toolbar',
    type: 'link',
    name: 'Toolbar',
    icon: 'voicemail',
    isVisible: false,
  },
  {
    state: 'progress-snipper',
    type: 'link',
    name: 'Progress snipper',
    icon: 'border_horizontal',
    isVisible: false,
  },
  {
    state: 'progress',
    type: 'link',
    name: 'Progress Bar',
    icon: 'blur_circular',
    isVisible: false,
  },
  {
    state: 'dialog',
    type: 'link',
    name: 'Dialog',
    icon: 'assignment_turned_in',
    isVisible: false,
  },
  {
    state: 'tooltip',
    type: 'link',
    name: 'Tooltip',
    icon: 'assistant',
    isVisible: false,
  },
  {
    state: 'snackbar',
    type: 'link',
    name: 'Snackbar',
    icon: 'adb',
    isVisible: false,
  },
  {
    state: 'slider',
    type: 'link',
    name: 'Slider',
    icon: 'developer_mode',
    isVisible: false,
  },
  {
    state: 'slide-toggle',
    type: 'link',
    name: 'Slide Toggle',
    icon: 'all_inclusive',
    isVisible: false,
  },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
