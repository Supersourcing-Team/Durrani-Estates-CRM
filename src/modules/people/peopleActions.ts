/**
 * People & Teams list actions: inline slab assignment and delete.
 * (Deactivate / Reactivate reuse the existing `deactivate` modal and `reactivate` action.)
 * No users API exists in the frontend yet, so these update the engine state and the audit log.
 */
import { actions, closeM, confirmM, eng, render, toast } from "../../engine";

export function installPeopleActions(): void {
  const A = actions();

  /** args: [userId, slabId | ""] */
  A.userslab = (a: string[]) => {
    const u = eng.userById(a[0]);
    if (!u || u.role !== "agent") return;
    const next = a[1] || null;
    const was = u.slab || null;
    if (was === next) return;
    u.slab = next;
    const name = (id: string | null) => (id ? eng.S.set.slabs.find((x: any) => x.id === id)?.name || id : "None");
    eng.audit("Slab assigned", u.name, name(was), name(next));
    toast(`${u.name}: ${next ? name(next) : "no slab"}`, "ok");
    render();
  };

  /** args: [userId] - confirm first; blocked when the person still owns leads or manages a team. */
  A.userdelask = (a: string[]) => {
    const u = eng.userById(a[0]);
    if (!u) return;
    if (u.id === eng.me().id) {
      toast("You cannot delete your own account", "err");
      return;
    }
    const owned = eng.S.leads.filter((l: any) => l.owner === u.id).length;
    if (owned) {
      toast(`${u.name} still owns ${owned} lead${owned === 1 ? "" : "s"}. Deactivate them to move the leads first.`, "err");
      return;
    }
    if (eng.S.teams.some((t: any) => t.mgr === u.id)) {
      toast(`${u.name} manages a team. Assign another manager first.`, "err");
      return;
    }
    confirmM({
      title: `Delete ${u.name}?`,
      text: "This removes the account permanently. To keep their history, deactivate them instead.",
      ok: "Delete",
      act: "userdel|" + u.id,
      danger: true,
    });
  };

  A.userdel = (a: string[]) => {
    const S = eng.S;
    const i = S.users.findIndex((x: any) => x.id === a[0]);
    if (i < 0) return;
    const [u] = S.users.splice(i, 1);
    eng.audit("User deleted", u.name, eng.ROLEN[u.role] + " · " + u.emp, "Deleted");
    eng.UI.c = null;
    closeM();
    toast(u.name + " deleted", "ok");
    render();
  };
}
