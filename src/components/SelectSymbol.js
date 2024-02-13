export default function SelectSymbol({selectedSymbol,setSymbol,isGameStart}){
    const onSelect = (e)=>{
        if(!isGameStart){
            return 
        } 
        setSymbol(e.target.innerHTML)
    }
    return (
        <div>
            <h2 className="mb-3 text-base font-medium"> Select your symbol</h2>
            <div onClick={onSelect} className="flex justify-between w">
            <div className={`${selectedSymbol==="X" && "bg-purple-500 text-white-500"} hover:cursor-pointer text-xl px-5 py-2 border rounded-md`}>X</div>
            <div className={`${selectedSymbol==="O" && "bg-purple-500 text-white-500"} hover:cursor-pointer text-xl px-5 py-2 border rounded-md`}>O</div>

            </div>
        </div>
    )
}