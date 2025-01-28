import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Input from "../Input"

export default function TenderDetailsComponent({
    name,
    icon,
    detail,
    value,
    color,
    dataType,
    isEdittingTenderInformation,
    onChange,
}) {
    return (
        <div>
            {icon ? <FontAwesomeIcon icon={icon} color="#666666" /> : <span />}
            <div className="secondary-text">{detail}:</div>
            <div style={{ color }}>
                {!isEdittingTenderInformation ? (
                    value
                ) : (
                    <Input
                        type={dataType}
                        name={name}
                        value={value}
                        style={{
                            marginTop: 0,
                            width: "-webkit-fill-available",
                        }}
                        onChange={onChange}
                        required
                    />
                )}
            </div>
        </div>
    )
}
