/* Primary action button with inline spinner while an API call is in flight. */
import React from "react";

type Props = {
  busy?: boolean;
  label: React.ReactNode;
  busyLabel?: string;
  cls?: string;
  act?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

export function BusyBtn({
  busy,
  label,
  busyLabel = "Please wait…",
  cls = "btn pri",
  act,
  disabled,
  type = "button",
}: Props) {
  const on = !!busy;
  return (
    <button
      className={cls + (on ? " is-busy" : "")}
      type={type}
      data-act={on ? undefined : act}
      disabled={on || disabled || undefined}
      aria-busy={on || undefined}
    >
      {on ? (
        <>
          <span className="btnspin" aria-hidden="true" />
          {busyLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
