import React from "react";

const ProgressBar = (props) => {
    const [ waves ] = props;
    const progressBar = {
        backgroundColor: '#FFF',
        width: '100%',
        height: 20,
        borderRadius: 10,
        fillColor: '#F34FB3',
        padding: 5,
        alignContent: 'center',
    };
    const loaderStyle = {
        color: '#FBAF34',
        padding: 5,
    }
    return(
        <div style={progressBar}>
            <span style={loaderStyle}>{`${waves}`}</span>
        </div>
    )
}

export default ProgressBar;