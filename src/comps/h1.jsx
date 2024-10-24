import "./h1.css";

export default function H1({id, children}){
    return(
        <h1 id={id} className="h1_main">
            {children}
        </h1>
    )
}