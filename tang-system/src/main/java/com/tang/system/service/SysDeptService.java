package com.tang.system.service;

import java.util.List;

import com.tang.commons.utils.tree.TreeSelect;
import com.tang.system.entity.SysDept;

/**
 * 部门表 SysDept 表服务接口
 *
 * @author Tang
 */
public interface SysDeptService {

    /**
     * 获取部门列表
     *
     * @param dept 部门对象
     * @return 部门列表
     */
    List<SysDept> selectDeptList(SysDept dept);

    /**
     * 获取部门树
     *
     * @param dept 部门对象
     * @return 部门树
     */
    List<SysDept> selectDeptListTree(SysDept dept);

    /**
     * 获取部门树下拉选项
     *
     * @param dept 部门对象
     * @return 部门树下拉选项
     */
    List<TreeSelect> selectDeptTree(SysDept dept);

    /**
     * 通过主键查询单条数据
     *
     * @param deptId 主键
     * @return 部门对象
     */
    SysDept selectDeptByDeptId(Long deptId);

    /**
     * 新增部门
     *
     * @param dept 部门对象
     * @return 影响行数
     */
    int insertDept(SysDept dept);

    /**
     * 修改部门信息
     *
     * @param dept 部门对象
     * @return 影响行数
     */
    int updateDeptByDeptId(SysDept dept);

    /**
     * 修改部门状态
     *
     * @param dept 部门对象
     * @return 影响行数
     */
    int updateDeptStatusByDeptId(SysDept dept);

    /**
     * 通过主键删除数据
     *
     * @param deptId 主键
     * @return 影响行数
     */
    int deleteDeptByDeptId(Long deptId);

    /**
     * 是否含有子部门
     *
     * @param deptId 部门ID
     * @return 结果
     */
    boolean checkHasChildren(Long deptId);

}
