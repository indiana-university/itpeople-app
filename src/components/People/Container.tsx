import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../types';
import PeopleList from './Presentation';
import { fetchRequest, IState } from './store';
import { Loader } from '../Loader';


interface IPropsFromDispatch {
    peopleFetchRequest: typeof fetchRequest,
}

class Container extends React.Component<IState & IPropsFromDispatch>{

    public componentDidMount() {
        this.props.peopleFetchRequest()
    }

    public render() {
        const data = this.props.data || {};
        return (
            <Loader {...this.props}>
                <PeopleList {...data} />
            </Loader>
        )
    }
}

const mapStateToProps = (state: IApplicationState) => state.people;

const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
    peopleFetchRequest: () => dispatch(fetchRequest()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container)
