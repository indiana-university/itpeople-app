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
  const { id, variant, size, modifier, innerRef, title, children, buttonText, closeModal, current, onOpen, openModal } = props;
  const isOpen = id == props.current;
  const buttonProps = { variant, size, modifier, innerRef, title, onClick: () => props.openModal(id) };
  const modalProps = { title, children, buttonText, closeModal, current, onOpen, openModal, isOpen, onDismiss: closeModal };

  if (isOpen && props.onOpen) {
    props.onOpen();
  }
  return (
    <>
      <Button type="button" {...buttonProps}>
        {props.buttonText}
      </Button>
      <RivetModal {...modalProps} />
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
