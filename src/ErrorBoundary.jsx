import React from "react";

export class ErrorBoundary extends React.Component{
    constructor(props){
        super(props);
        this.state={
            hasError:false,
            error:null,
            errorInfo:null
        }
    }
    static getDerivedStateFromError(error){
        return {hasError:true,error}
    }

    componentDidCatch(error, errorInfo){
        this.setState({errorInfo});
    }

    render(){
        if(this.state.hasError){
            return(
                <div className="p-10 text-center">
                    <h1 className="text-3xl font-bold text-red-600">Something Went Wrong</h1>
                    <p className="text-gray-600 mt-4">{this.state.error?.messsage}</p>
                </div>
            )
        }

        return this.props.children;
    }
}

