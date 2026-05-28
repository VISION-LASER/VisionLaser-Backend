const { db } = require('../config/connectDatabase');

const buildModel = (table, fields) => {
    const fieldList = fields.join(', ');
    const selectFields = ['id', ...fields, 'created_at', 'updated_at'].join(', ');

    const findAll = async () => {
        const [rows] = await db.query(`SELECT ${selectFields} FROM ${table} ORDER BY id DESC`);
        return rows;
    };

    const findById = async (id) => {
        const [rows] = await db.query(`SELECT ${selectFields} FROM ${table} WHERE id = ?`, [id]);
        return rows[0];
    };

    const create = async (data) => {
        const values = fields.map((field) => data[field] ?? null);
        const placeholders = fields.map(() => '?').join(', ');

        const [result] = await db.query(
            `INSERT INTO ${table} (${fieldList}) VALUES (${placeholders})`,
            values
        );

        return findById(result.insertId);
    };

    const update = async (id, data) => {
        const updateFields = fields.filter((field) => Object.prototype.hasOwnProperty.call(data, field));

        if (updateFields.length === 0) {
            return findById(id);
        }

        const setClause = updateFields.map((field) => `${field} = ?`).join(', ');
        const values = updateFields.map((field) => data[field]);

        await db.query(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [...values, id]);
        return findById(id);
    };

    const remove = async (id) => {
        const [result] = await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    };

    return {
        findAll,
        findById,
        create,
        update,
        remove
    };
};

module.exports = buildModel;
