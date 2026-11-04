/*
 * Screen and modal registry. Keys match the prototype's route keys (R) and modal keys (MD),
 * so every data-go / data-open in the app resolves the same way as in the prototype.
 */
import type { ScreenMap, ModalMap } from './types';
import * as home from '../modules/home';
import * as account from '../auth/features';
import * as leads from '../modules/leads';
import * as leadmodals from '../modules/leadmodals';
import * as deals from '../modules/deals';
import * as notes from '../modules/notes';
import * as people from '../modules/people';
import * as mgmt from '../modules/mgmt';
import * as assign from '../modules/assign';
import * as review from '../modules/review';
import * as admin from '../modules/admin';

const groups = [home, account, leads, leadmodals, deals, notes, people, mgmt, assign, review, admin];

export const screens: ScreenMap = Object.assign({}, ...groups.map((g) => g.screens));
export const modals: ModalMap = Object.assign({}, ...groups.map((g) => g.modals));
