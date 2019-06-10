Ext.define('Ming.expand.ux.data.reader.MenuJson', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.menujson',

    getResponseData: function (response) {
        var error;
        return [{"id":"EXT_TEST_MAIN","text":"EXT测试","visible":true,"children":[{"id":null,"text":"客户管理","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.cuscustomer.CusCustomer"}],"leaf":false,"expanded":false},{"id":"W_IMP","text":"国际进港","visible":true,"children":[{"id":null,"text":"海关放行","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.cuss.ctmlastrcv.CtmLastrcv"},{"id":null,"text":"批量分单理货","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.bulksplittally.BulkSplitTally?domInt=I&expImp=I"},{"id":null,"text":"进港运单录入","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.waybill.Waybill?domInt=I&expImp=I"},{"id":null,"text":"舱单操作","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.manifest.Manifest?domInt=I&expImp=I"},{"id":null,"text":"运单报文导入","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.message.Message?domInt=I&expImp=I"},{"id":null,"text":"进港理货","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.tally.Tally?domInt=I&expImp=I"},{"id":null,"text":"提货办单","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.goodsorder.GoodsOrder?domInt=I&expImp=I"},{"id":null,"text":"提货出库","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.goodsdelivery.GoodsDeliveryTab?domInt=I&expImp=I"},{"id":null,"text":"提货通知","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.goodsnotice.GoodsTab?domInt=I&expImp=I"},{"id":null,"text":"进港分单理货","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.single.Single"},{"id":null,"text":"运单结算","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.fee.settlement.SettlementTab"},{"id":null,"text":"收费处理","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.fee.chargefee.ChargeFeeTab?domInt=I&expImp=I"},{"id":null,"text":"发票管理","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.fee.invoicemanagement.InvoiceManagement"},{"id":null,"text":"不正常","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.abn.Abn?domInt=I&expImp=I"},{"id":null,"text":"提单","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.imp.awbpick.AwbPickTab"}],"leaf":false,"expanded":false},{"id":"W_BAS","text":"基础数据","visible":true,"children":[{"id":null,"text":"精度定义","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.precisiondefinition.PrecisionDefinition"},{"id":null,"text":"重量单位","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.weight.Weight"},{"id":null,"text":"体积单位","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.volume.Volume"},{"id":null,"text":"装机优先级","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.loadlevel.LoadLevel"},{"id":null,"text":"单证类型","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.stocktype.StockType"},{"id":null,"text":"包装信息","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.packinfo.PackInfo"},{"id":null,"text":"特货代码","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.specopecls.Specopecls"},{"id":null,"text":"共享代码信息","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.sharecode.ShareCode"},{"id":null,"text":"ULD类型","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.uldtype.UldType"},{"id":null,"text":"消息类型","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.messagetype.MessageType"},{"id":null,"text":"退仓原因","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.returnreason.ReturnReason"},{"id":null,"text":"板型管理","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.ctrcode.CtrCode"},{"id":null,"text":"板位管理","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.loadposition.LoadPosition"},{"id":null,"text":"城市信息","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.city.City"},{"id":null,"text":"数据字典","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.mappinglist.MappingList"},{"id":null,"text":"客户管理","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.cuscustomer.CusCustomer"},{"id":null,"text":"机舱位板位","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.deckcontours.DeckContours"},{"id":null,"text":"仓库设置","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.warehouse.WareHouse"},{"id":null,"text":"地区信息","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.areas.Areas"},{"id":null,"text":"国家信息","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.country.Country"},{"id":null,"text":"城市机场","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.airport.Airport"},{"id":null,"text":"不正常类型","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.abntypes.AbnTypes"},{"id":null,"text":"提货通知失败","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.noticefail.NoticeFail"},{"id":null,"text":"货物种类","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.cargosort.CargoSort"},{"id":null,"text":"承运人","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.carrier.Carrier"},{"id":null,"text":"货币信息","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.currency.Currency"},{"id":null,"text":"计费方式","visible":true,"leaf":true,"type":"01","expanded":false,"url":"Ming.view.base.feeway.Feeway"}],"leaf":false,"expanded":false},{"id":"INVOICESET","text":"设置发票起止号","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FEEMODIFYAFTERBALANCE","text":"结算后修改费用权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"BALANCECANCEL","text":"取消结算权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FLTDEL","text":"航班航站作废删除权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"ABNADV","text":"不正常管理高级权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FILWHS","text":"文件岗位人员可进行仓库货物管理的权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FILDEL","text":"运单删除权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FILREPEAL","text":"运单作废权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FILREPEALCANCEL","text":"运单作废取消权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"REPROTS_DOWNLOAD","text":"统计报表不过滤数据下载","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"REPROTS_APPROVAL","text":"统计报表审核","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"WHSADJUST","text":"货物出入库、更新货物件数和重量权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"INVOICEDEL","text":"发票作废权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FEEMODIFY","text":"费用修改权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"DELIMPFILERECORD","text":"取消归档权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FEECANCEL","text":"费用作废权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"MODIFYAWBCHKED","text":"直接修改运单单货审核状态权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"IMPFILESAVE","text":"进港航班文件运单分页保存权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"IMPMENIFESTSAVE","text":"进港航班文件舱单分页保存权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"FILPIGEONHOLE","text":"运单归档权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"RELEASEINVOICENUM","text":"释放发票号权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"AWBARRIVE","text":"运单交付权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"PRINTCONTENTSET","text":"报表内容设置权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"LAYOUTMAKEUP","text":"自助排版权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"HBILLIDDEL","text":"分单删除权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"RECANCELINVOICE","text":"取消发票作废","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"AWBALLOPERATE","text":"交单后，可以修改运单任何信息的权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"AWBPARTOPERATE","text":"交单后，可以修改运单部分信息的权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"SETCHANNEL","text":"设置通道权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"ILINKTTYQUERY","text":"内联通报文计划及内容查询权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"AFTERFEEAWBDEL","text":"计费或结算后不允许删除运单的权限","visible":false,"children":[],"leaf":false,"expanded":false},{"id":"BILLFEE","text":"是否有查询月结账单的权限","visible":false,"children":[],"leaf":false,"expanded":false}];

        if (typeof response.responseJson === 'object') {
            return response.responseJson;
        }

        try {
            return Ext.decode(response.responseText);
        } catch (ex) {
            error = this.createReadError(ex.message);

            Ext.Logger.warn('Unable to parse the JSON returned by the server');
            this.fireEvent('exception', this, response, error);
            return error;
        }
    },

    buildHierarchy: function (arry) {
        var roots = [], children = {}, i, len;

        // find the top level nodes and hash the children based on parent
        for (i = 0, len = arry.length; i < len; ++i) {
            var item = arry[i],
                p = item.Parent,
                target = !p ? roots : (children[p] || (children[p] = []));

            target.push({value: item});
        }

        // function to recursively build the tree
        var findChildren = function (parent) {
            if (children[parent.value.Id]) {
                parent.children = children[parent.value.Id];
                for (var i = 0, len = parent.children.length; i < len; ++i) {
                    findChildren(parent.children[i]);
                }
            }
        };

        // enumerate through to handle the case where there are multiple roots
        for (i = 0, len = roots.length; i < len; ++i) {
            findChildren(roots[i]);
        }
        return roots;
    }

});