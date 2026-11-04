/* Edit an active note (prototype modal cn-edit, args [noteId]). Saves with the cnedit action. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MSel, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const CnEditModal: ModalComp = ({ args }) => {
  const n = eng.noteById(args[0]);
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={`cnedit|${n.id}`}>Save</button>
    </>
  );
  return (
    <Modal title={'Edit ' + n.id} foot={foot}>
      <Fld label="Agent who sold it" htmlFor="m_agent" hint="Changing this moves future follow-up to the new agent.">
        <MSel k="agent" opts={eng.agentsAll().map((u: any) => [u.id, u.name] as [string, string])} blank={false} />
      </Fld>
      <Fld label="Internal note" htmlFor="m_txt"><MTxa k="txt" /></Fld>
      <Bn kind="info" title="" body="Principal, term and rate cannot be edited after approval. Create a new note instead." />
    </Modal>
  );
};
