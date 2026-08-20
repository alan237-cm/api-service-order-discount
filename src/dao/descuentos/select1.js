import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";
import { selColumnsDescByBot, selColumnsDesc, selColumnsDescPaguinado,ftSearchTerm,ftType,ftStartDate,ftEndDate,ftOffsetDes } from './listaquery.js'

//consulta por id_bot
export const getDesByIdBot = async function (id_bot) {
  //console.log("Select Descuentos");
  let descuen;
  try {
    descuen = await getClient();
    //consulta para obtener los descuentos por id_bot
    const resultado = await descuen.query(selColumnsDescByBot, [id_bot]);
    descuen.release();
    //devuelve los valores de la consulta
    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {//en caso de error entra en el catch
    if (descuen) descuen.release();
    logger.debug(err);
    return err;//devuleve el error
  }
};

//consulta por id_bot con filtros y paguinado
export const getDescuentosPaginados = async (idbot, startIndex, pageSize, searchTerm, filterType, startDate, endDate) => {
  //console.log("Select Descuentos");
  let client;
  try {
    client = await getClient();
    let contador = selColumnsDescPaguinado;//consulta para contar los registros, hasta el momento
    let query = selColumnsDescByBot;//consulta para obtener los registros 
    let params = [idbot];
    let paramsCount = [idbot];
    let paramIndex = 2; //servira para los filtros a ingresar

    if (searchTerm) {//en caso de mandar un filtro de busqueda por termino entra aqui
      const filter = ftSearchTerm(paramIndex);//consulta por el termino mandado
      query += filter;//se agrega el filtro a la consulta de registros
      contador += filter;//se agrega a la consulta para contar
      params.push(`%${searchTerm}%`);
      paramsCount.push(`%${searchTerm}%`);
      paramIndex++;//aumenta paramIndex por si se ocupa otro filtro
    }
    if (startDate) {//en caso de mandar un filtro por fecha inicio de descuento entra aqui
      const filter = ftStartDate(paramIndex);//consulta por el filtro mandado
      query += filter;//se agrega el filtro a la consulta de registros
      contador += filter;//se agrega a la consulta para contar
      params.push(startDate);
      paramsCount.push(startDate);
      paramIndex++;//aumenta paramIndex por si se ocupa otro filtro
    }
    if (endDate) {//en caso de mandar un filtro por fecha fin de descuento entra aqui
      const filter = ftEndDate(paramIndex);//consulta por el filtro mandado
      query += filter;//se agrega el filtro a la consulta de registros
      contador += filter;//se agrega a la consulta para contar
      params.push(endDate);
      paramsCount.push(endDate);
      paramIndex++;//aumenta paramIndex por si se ocupa otro filtro
    }

    query += ftOffsetDes(paramIndex);//se agrega offset y limit para el paginado
    params.push(pageSize, startIndex);
    //manda el resultado del contador
    const resultadoTotal = await client.query(contador, paramsCount);
    let resultCount = resultadoTotal.rows.length > 0 ? resultadoTotal.rows[0].totalrows : 0;
    //resultado de la consulta
    const resultado = await client.query(query, params);
    client.release();
    //devuelve el resultado de la consulta junto al total de registros
    return resultado.rows.length > 0 
      ? { rows: resultado.rows, Total: resultCount }
      : { rows: [], Total: 0 };

  } catch (err) {//en caso de un error entra en el catch
    if (client) client.release();
    return err;//devuelve el error
  }
};


export const getDescuent10 = async function () {
    let descuen;
    try {
      descuen = await getClient();
  
      const query = `SELECT nombre, descripcion, tipo_descuento, valor, codigo
      FROM orders_bot.descuentos
      WHERE CAST(valor AS NUMERIC) > 10;`;
  
      const resultado = await descuen.query(query);
      descuen.release();
  
      return resultado.rows.length > 0 ? resultado.rows : [false];
    } catch (err) {
      if (descuen) descuen.release();
      logger.debug(err);
      return err;
    }
  };