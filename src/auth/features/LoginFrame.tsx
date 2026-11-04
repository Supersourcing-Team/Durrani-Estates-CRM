/*
 * Frame of the public sign-in pages (login, login-forgot, invite): logo and form on the left, photo card on the
 * right. Approved sign-in design, Nov 2026. The photo card hides on screens narrower than 900 px.
 */
import React from 'react';
import { Logo } from '../../project-layout/Shell';

/** `bare`: the page lays out its own content (sign-in); otherwise content is stacked with the standard spacing. */
export function LoginFrame({ children, bare }: { children: React.ReactNode; hero?: React.ReactNode; bare?: boolean }) {
  return (
    <div className="auth">
      <div className="auth-l">
        <div className="auth-form">
          <div className="auth-logo"><Logo /></div>
          {bare ? children : <div className="auth-body">{children}</div>}
        </div>
      </div>
      <div className="auth-r" aria-hidden="true">
        <div className="auth-badge">PREMIUM REAL ESTATE CONSULTANTS</div>
        <div className="auth-cap">
          <h2>Find an address<br />that feels like yours.</h2>
          <p>Durrani Estates connects discerning buyers and investors with exceptional residential and commercial
            properties, offering trusted guidance from discovery to closing.</p>
        </div>
      </div>
    </div>
  );
}
