import "./div.css";

export default function Div({id, width=null, hight=null, children}){
    if(width && hight){
        return( 
            <div id={id} className="bg-div" style={{height: hight + "px", width: width + "px"}}>
                {children}
            </div>
        );
    }else{
        return( 
            <div id={id} className="bg-div inline-block">
                {children}
            </div>
        );
    }
}