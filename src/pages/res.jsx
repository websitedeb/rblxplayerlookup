import { useParams } from "react-router-dom";
import Div from "../comps/div";
import Spinner from "../comps/spinner";
import { useQuery } from "@tanstack/react-query";

export default function Res() {
    const { userName } = useParams();

    const { data: res, error, isLoading } = useQuery({
        queryKey: ["userData", userName],
        queryFn: async () => {
            const response = await fetch(`/api/${userName}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
        enabled: !!userName,
    });

    if (isLoading) return <Spinner />;
    if (error) return <p>{error.message}</p>;

    
    const { user, img, gender } = res || {};

    return (
        <div className="text-white font-inter" id="main">
            {user && (
                <div id="main" className="flex flex-col items-center gap-5 p-5">
                    <Div id="person" className="text-center p-2 panel">
                        {img && <img src={img} alt="Avatar" className="w-48 h-48 rounded-full border-4 border-cyan-400" />}
                        <h1 className="text-xl font-bold">{user.displayName}</h1>
                        <h2 className="text-xl font-bold">@{user.name}</h2>
                        <h5><i class="bi bi-hash"></i>{userName}</h5>
                    </Div>
                    <Div id="gender" className="flex justify-center items-center gap-2 panel">
                        &nbsp;<div dangerouslySetInnerHTML={{ __html: gender }} id="gender" style={{fontSize: "xx-large"}}/>&nbsp;
                    </Div>
                    <Div id="time" className="text-center text-gray-400 p-2 panel">
                        <i class="bi bi-calendar-event-fill text-2xl font-bold"></i>
                        <p>&nbsp;Created At: {new Date(user.createTime).toLocaleString()}&nbsp;</p>
                        <i class="bi bi-globe-americas text-2xl font-bold"></i><p>Locale: {user.locale}</p>
                    </Div>
                    <div className="flex panel">
                        <Div className="bg-indigo-700 p-5 rounded-lg text-white max-h-4 max-w-4" width={300 + "px"} hight={500 + "px"}>
                            {(() => {
                                if(user.about !== ''){
                                    return (
                                        <>
                                            <p className="text-left">&nbsp;<i class="bi bi-file-person-fill text-2xl"> </i>About-&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                            <p id="about">&nbsp;{user.about}&nbsp;</p>
                                        </>
                                    )
                                }
                                else{
                                    return <p className="text-center"> No About </p>
                                }
                            })()}
                        </Div>
                        &nbsp;
                        <Div id="tags" className="flex justify-around w-full p-2 panel">
                            <p>
                                <span className={user.idVerified ? "text-green-500" : "text-red-500"}>
                                    &nbsp;&nbsp;<i className="bi bi-patch-check-fill text-2xl"></i>&nbsp;
                                    ID Verified: {user.idVerified ? "Yes" : "No"}
                                </span>&nbsp;
                            </p>
                            <p>
                                <span className={user.premium ? "text-green-500" : "text-red-500"}>
                                    <i className="bi bi-gem text-2xl"></i>&nbsp;
                                    Premium: {user.premium ? "Yes" : "No"}
                                </span>&nbsp;
                            </p>
                        </Div>
                    </div>
                    <Div id="social panel">
                        {(() => {
                            try {
                                if (!user || !user.socialNetworkProfiles) {
                                    throw new Error("Missing social network profiles data");
                                }
                                return (
                                    <ul class="list-group text-left text-2xl">
                                        <li class="border-b-4 border-gray-800">&nbsp;<i class="bi bi-facebook text-blue-700"></i> Facebook: {user.socialNetworkProfiles.facebook || "N/A"}&nbsp;</li>
                                        <li class="border-b-4 border-gray-800">&nbsp;<i class="bi bi-twitter-x text-black"></i> Twitter: {user.socialNetworkProfiles.twitter || "N/A"}&nbsp;</li>
                                        <li class="border-b-4 border-gray-800">&nbsp;<i class="bi bi-youtube text-red-700"></i> YouTube: {user.socialNetworkProfiles.youtube || "N/A"}&nbsp;</li>
                                        <li>&nbsp;<i class="bi bi-twitch text-purple-800"></i> Twitch: {user.socialNetworkProfiles.twitch || "N/A"}&nbsp;</li>
                                    </ul>
                                );
                            } catch (error) {
                                return <p>No Social Media</p>;
                            }
                        })()}
                    </Div>
                </div>
            )}
        </div>
    );
    
}
