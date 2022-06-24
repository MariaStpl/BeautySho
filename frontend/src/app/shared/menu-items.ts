import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    { state: 'dashboard', name: 'Dashboard', icon: 'view_module', role: '' },
    { state: 'category', name: 'Manage Category', icon: 'category', role: 'admin' },
    { state: 'product', name: 'Manage Product', icon: 'inventory_2', role: 'admin' },
    { state: 'detail', name: 'Detail Product', icon: 'inventory_1', role: 'admin' },
    { state: 'order', name: 'Manage Order', icon: 'list_alt', role: '' },
    { state: 'orders', name: 'Orders', icon: 'receipt', role: 'admin' },
    { state: 'bill', name: 'View Bill', icon: 'receipt', role: '' },
    { state: 'user', name: 'View User', icon: 'people', role: 'admin' },
    
    
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}