import React from 'react';
import Button from 'react-bootstrap/Button';

const Pagination = () => {
    return(
        <>
            <Button disabled className="btn btn-disable wdth-175"> 2018</Button>
            <Button disabled className="btn btn-disable wdth-175"> 2019</Button>
            <Button disabled className="btn btn-disable wdth-175"> 2020</Button>
            <Button className="wdth-175"> 2021</Button>
        </>
    );
}

export default Pagination;

