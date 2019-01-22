/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../../types";
import { closeModal, openModal } from "./store";
import { Modal as RivetModal, Button } from "rivet-react";
import { ModalProps } from "rivet-react/build/dist/components/Modal/Modal";
import { ButtonProps } from "rivet-react/build/dist/components/Button/Button";

const Container: React.SFC<IElementProps> = (props: IProps) => {
  const { id, variant, size, modifier, innerRef, title } = props;
  const buttonProps = { variant, size, modifier, innerRef, title } ;
  let button = (
    <Button type="button" {...buttonProps} onClick={() => props.openModal(id)}>
      {props.buttonText}
    </Button>
  );
  const isOpen = id == props.current;
  if (isOpen && props.onOpen) {
    props.onOpen();
  }
  return (
    <>
      {button}
      <RivetModal {...props} isOpen={isOpen} onDismiss={props.closeModal} />
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  closeModal: () => dispatch(closeModal()),
  openModal: id => dispatch(openModal(id))
});

interface IDispatchProps {
  closeModal: typeof closeModal;
  openModal: typeof openModal;
}
interface IStateProps {
  current: string;
}

interface IElementProps extends ModalProps, ButtonProps {
  id: string;
  children?: any;
  title: string;
  buttonText?: string | JSX.Element;
  onOpen?: () => any;
}

interface IProps extends IDispatchProps, IStateProps, IElementProps {}

export const Modal = connect(
  (state: IApplicationState) => {
    return {
      current: state.modal
    };
  },
  mapDispatchToProps
)(Container);
