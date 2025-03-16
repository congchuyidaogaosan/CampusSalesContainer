package com.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName vending_machine
 */
@TableName(value ="vending_machine")
@Data
public class VendingMachine implements Serializable {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private Integer machineId;

    /**
     * 
     */
    private String machineNumber;

    /**
     * 
     */
    private String machineLocation;

    /**
     * 
     */
    private Integer machineCapacity;

    /**
     * 
     */
    private String machineStatus;

    private String machineImage;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        VendingMachine other = (VendingMachine) that;
        return (this.getMachineId() == null ? other.getMachineId() == null : this.getMachineId().equals(other.getMachineId()))
            && (this.getMachineNumber() == null ? other.getMachineNumber() == null : this.getMachineNumber().equals(other.getMachineNumber()))
            && (this.getMachineLocation() == null ? other.getMachineLocation() == null : this.getMachineLocation().equals(other.getMachineLocation()))
            && (this.getMachineCapacity() == null ? other.getMachineCapacity() == null : this.getMachineCapacity().equals(other.getMachineCapacity()))
            && (this.getMachineStatus() == null ? other.getMachineStatus() == null : this.getMachineStatus().equals(other.getMachineStatus()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getMachineId() == null) ? 0 : getMachineId().hashCode());
        result = prime * result + ((getMachineNumber() == null) ? 0 : getMachineNumber().hashCode());
        result = prime * result + ((getMachineLocation() == null) ? 0 : getMachineLocation().hashCode());
        result = prime * result + ((getMachineCapacity() == null) ? 0 : getMachineCapacity().hashCode());
        result = prime * result + ((getMachineStatus() == null) ? 0 : getMachineStatus().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", machineId=").append(machineId);
        sb.append(", machineNumber=").append(machineNumber);
        sb.append(", machineLocation=").append(machineLocation);
        sb.append(", machineCapacity=").append(machineCapacity);
        sb.append(", machineStatus=").append(machineStatus);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}