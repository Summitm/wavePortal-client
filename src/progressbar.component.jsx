import React from "react";

const ProgressBar = (props) => {
    const { waves } = props;
    const progressBar = {
        backgroundColor: '#FFF',
        width: '100%',
        height: 10,
        borderRadius: 10,
        fillColor: '#F34FB3',
        padding: 2,
        alignContent: 'center',
        marginBottom: 20,
    };
    const loaderStyle = {
        color: '#000000',
        padding: 5,
    }
    return(
        <div style={progressBar}>
            <span style={loaderStyle}>{`${waves}`}</span>
        </div>
    )
}

export default ProgressBar;