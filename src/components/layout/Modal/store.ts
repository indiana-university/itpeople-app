import { action } from 'typesafe-actions';
import { Reducer } from 'redux';


export const enum ModalActionTypes {
    MODAL_OPEN = '@@modal/MODAL_OPEN',
    MODAL_CLOSE = '@@modal/MODAL_CLOSE'
}
function openModal(id: string) {
    return action(ModalActionTypes.MODAL_OPEN, id);
}
function closeModal() {
    return action(ModalActionTypes.MODAL_CLOSE, null);
}
const reducer: Reducer<string> = (state = "", action) => {
    switch (action.type) {
        case ModalActionTypes.MODAL_OPEN: return action.payload || state;
        case ModalActionTypes.MODAL_CLOSE: return "";
        default: return state;
    }
};


export {
    openModal,
    closeModal,
    reducer,
}