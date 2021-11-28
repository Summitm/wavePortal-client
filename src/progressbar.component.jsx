import React from "react";

const ProgressBar = (props) => {
    // const { waves } = props;
    // <div className="progress"><ProgressBar waves={totalWaves} /></div>
    console.log(props);
    const progressBar = {
        backgroundColor: '#FFF',
        width: '100%',
        height: 20,
        borderRadius: 10,
        // padding: 5,
        alignItems: 'center',
        marginBottom: 20,
    };
    const loaderStyle = {
        backgroundColor: '#FEBF34',
        height: '100%',
        width: `${props.waves}%`,
        borderRadius: 'inherit',
        textAlign: 'right',
    }
    const textStyles = {
        color: 'blue',
        padding:5,
    }
    return(
        <div style={progressBar}>
            <div style={loaderStyle}>
                <span style={textStyles}>{props.waves}</span>
            </div>
        </div>
    )
}

export default ProgressBar;