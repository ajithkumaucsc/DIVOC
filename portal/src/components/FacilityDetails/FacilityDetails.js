import React, {useState} from "react";
import "./FacilityDetails.css";
import {CheckboxItem, FacilityFilterTab, RadioItem} from "../FacilityFilterTab";
import NotifyPopup from "../NotifiyPopup/NotifiyPopup";
import info from "../../assets/img/info.png";
import check from "../../assets/img/check.png";
import {API_URL} from "../../utils/constants";
import {useAxios} from "../../utils/useAxios";

function FacilityDetails({
                             facilities, setFacilities, selectedState, onStateSelected, districtList, selectedDistrict,
                             setSelectedDistrict, stateList, programs, selectedProgram, setSelectedProgram, facilityType, setFacilityType,
                             status, setStatus, fetchFacilities
                         }) {
    const axiosInstance = useAxios('');
    const [modalShow, setModalShow] = useState(false);

    const [allChecked, setAllChecked] = useState(false);

    const handleChange = (value, setValue) => {
        setValue(value);
    };


    const handleAllCheck = (e) => {
        let list = [...facilities];
        setAllChecked(e.target.checked);
        list = list.map((ele) => ({
            ...ele,
            isChecked: e.target.checked
        }));
        setFacilities(list);
    };

    const updateFacility = (index, key, value) => {
        const facilityData = [...facilities];
        facilityData[index][key] = value;
        setFacilities(facilityData);
    };

    const getFacilityList = () => {
        return facilities.map((facility, index) => (
            <tr>
                <td>{facility.facilityCode}</td>
                <td>{facility.facilityName}</td>
                <td>{facility.admins ? <img src={check}/> : <img src={info}/>}</td>
                <td>{facility.seal ? <img src={check}/> : <img src={info}/>}</td>
                <td>{facility.roleSetup ? <img src={check}/> : <img src={info}/>}</td>
                <td>
                    <CheckboxItem
                        text={facility['id']}
                        showText={false}
                        checked={facility.isChecked}
                        onSelect={() => {
                            updateFacility(index, "isChecked", !facility.isChecked)
                        }}
                    />

                </td>
            </tr>
        ));

    };

    const handleNotifyClick = () => {
        setAllChecked(false);
        setModalShow(true);
    };

    const sendNotification = () => {
        const selectedFacilities = facilities.filter(facility => facility.isChecked);
        const notifyRequest = selectedFacilities.map(facility => {
            let req = {
                facilityId: facility.osid,
                contact: facility.contact,
                email: facility.email,
                pendingTasks: []
            };
            if(!facility.admins) {
                req.pendingTasks.push("vaccinators")
            }
            if(!facility.seal) {
                req.pendingTasks.push("seal")
            }
            if(!facility.roleSetup) {
                req.pendingTasks.push("roles")
            }
            return req
        });
        axiosInstance.current.post(API_URL.FACILITY_NOTIFY_API, notifyRequest)
            .then(res => {
                //registry update in ES happening async, so calling search immediately will not get back actual data
                // setTimeout(() => fetchFacilities(), 1000)
            });
    }
    return (
        <div className={"row container"}>
            <div className="col-sm-3">
                <FacilityFilterTab
                    programs={programs}
                    setSelectedProgram={setSelectedProgram}
                    states={stateList}
                    setSelectedState={onStateSelected}
                    selectedState={selectedState}
                    districtList={districtList}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                    facilityType={facilityType}
                    setFacilityType={setFacilityType}
                >
                    <div>
                        <span className={"filter-header"}>Status</span>
                        <div className="m-3">
                            <RadioItem
                                text={"Active"}
                                checked={status === "Active"}
                                onSelect={(event) =>
                                    handleChange(event.target.name, setStatus)
                                }
                            />
                            <RadioItem
                                text={"Inactive"}
                                checked={status === "Inactive"}
                                onSelect={(event) =>
                                    handleChange(event.target.name, setStatus)
                                }
                            />
                        </div>

                    </div>
                </FacilityFilterTab>
            </div>

            <div className={"col-sm-7 container table"}>
                <p className={"highlight"}>
                    {selectedDistrict} facilties
                </p>
                <table className={"table table-hover table-data"}>
                    <thead>
                    <tr>
                        <th>CENTRE ID</th>
                        <th>CENTRE NAME</th>
                        <th>VACCINATOR DETAILS</th>
                        <th>FACILITY SEAL</th>
                        <th>ROLE SETUP</th>
                        <th>
                            <CheckboxItem
                                text={"checkAll"}
                                checked={allChecked}
                                onSelect={(e) => {
                                    handleAllCheck(e)
                                }}
                                showText={false}
                            />
                        </th>
                    </tr>
                    </thead>
                    <tbody>{getFacilityList()}</tbody>

                </table>
            </div>

            <div className="col-sm-2 container">
                <div className={"card card-continer"}>
                    <div className="card-body text-center">
                        <p>
                            Notify {facilities.filter(facility => facility.isChecked).length} facilities for the {selectedProgram}
                        </p>
                        <button
                            onClick={() => handleNotifyClick()}
                            className={"button"}
                        >
                            NOTIFY
                        </button>
                        <NotifyPopup
                            show={modalShow}
                            onHide={() => {
                                setModalShow(false)
                            }}
                            onSend={()=>{
                                setModalShow(false)
                                sendNotification()
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FacilityDetails;