import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import AlphabetList from '../../utils/AlphabetList';

import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_DESIGNERS, } from '../../utils/actions';
import { QUERY_DESIGNERS, } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

const DesignerList = (props) => {
    const [state, dispatch] = useStoreContext();

    const { loading, data: designerData } = useQuery(QUERY_DESIGNERS);

    useEffect(() => {
        if (designerData) {
            dispatch({
                type: UPDATE_DESIGNERS,
                payload: designerData.designers,
            });
            designerData.designers.forEach((product) => {
                idbPromise('designers', 'put', product);
            });
        } else if (!loading) {
            idbPromise('designers', 'get').then((designers) => {
                dispatch({
                    type: UPDATE_DESIGNERS,
                    payload: designers,
                });
            });
        }

    }, [designerData, loading, dispatch]);

    let designerNames = state.designers.map((designer) => designer.name);

    return (
        <section className="main-content-container">
            <div className="main-content-row">
                <h3>Designers</h3>
            </div>
            <div className="main-content-row">
                <div className="designer-list-content-wrapper">
                    <AlphabetList
                        className="designer-list"
                        data={(designerNames)}
                        generateFn={
                            (item, index) => {
                                return (
                                    <div key={item}>
                                        <Link to={`/shop/designers/${item}`} className="link">
                                            {item}
                                        </Link>
                                    </div>
                                )
                            }
                        }
                    />
                </div>
            </div>
        </section >
    );
};

export default DesignerList;