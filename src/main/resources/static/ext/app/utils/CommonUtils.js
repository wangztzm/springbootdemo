/**
 * 辅组方法
 */
Ext.define('Ming.utils.CommonUtils', {
	alternateClassName: 'CU',
	statics: {
		/**
		 * 获取UUID
		 * @param {} len
		 * @param {} radix
		 * @return {}
		 */
		getUUID: function(len, radix) {
			var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var chars = CHARS,
				uuid = [],
				i;
			radix = radix || chars.length;
			if(len) {
				for(i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
			} else {
				var r;
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';
				for(i = 0; i < 36; i++) {
					if(!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
					}
				}
			}

			return uuid.join('');
		},

		/**
		 * 转换为boolean类型
		 * @param {} v
		 * @return {}
		 */
		getBoolean: function(v) {
			return v == true || v == '1' || v == 1 || v == 'true';
		},

		/**
		 * 数据对象转换为string值(url参数)
		 * @param paramsobj  数据对象{a:1,b=2}
		 * @return string(&a=1&b=2)
		 */
		parseParams: function(paramsobj) {
			var paramsstr = '';
			for(var key in paramsobj) {
				var value = paramsobj[key];
				if(Ext.isEmpty(value, true)) continue;
				if(Ext.isArray(value)) {
					for(var i = 0; i < value.length; i++) {
						paramsstr += '&' + key + '=' + value[i];
					}
				} else {
					paramsstr += '&' + key + '=' + value;
				}
			}

			return paramsstr;
		},

		/**
		 * 字符串转对象
		 * @param {} v 字符串
		 * @return {}
		 */
		toObject: function(v) {
			return Ext.isEmpty(v) ? v : Ext.decode(v);
		},

		/**
		 * 对象转字符串
		 * @param {} v 对象
		 * @return {}
		 */
		toString: function(v) {
			return Ext.encode(v);
		},

		/**
		 * 数据为{user:{name:'111'}}；转换数据为{'user.name': '111'}。
		 * @param {} obj
		 * @param {} name
		 * @param {} map
		 * @return {}
		 */
		toParams: function(obj, name, map) {
			var key;
			if(!Ext.isObject(obj)) return obj;
			map = map ? map : {};
			for(key in obj) {
				var o = obj[key];
				if(Ext.isObject(o)) {
					CU.toParams(o, key, map);
				} else {
					if(Ext.isEmpty(name)) {
						map[key] = o;
					} else {
						map[name + '.' + key] = o;
					}
				}
			}

			return map;
		},

		/**
		 * 对象日志
		 * */
		log: function(obj) {
			console.log(obj);
		},

		/**
		 * 根据类和方法获取url
		 */
		getURL: function(service, method) {
			var key = service + '_' + method;

			return cfg.urls[key.toUpperCase()].url;
		},

		/**
		 * 将数值四舍五入后格式化.
		 * @param num 数值(Number或者String)
		 * @param cent 要保留的小数位(Number)
		 * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
		 * @return 格式的字符串,如'1,234,567.45'
		 * @type String
		 */
		formatNumber: function(num, cent, isThousand) {
			num = num.toString().replace(/$|,/g, '');
			if(isNaN(num)) num = '0';
			if(isNaN(cent)) cent = 0;
			cent = parseInt(cent, 0);
			cent = Math.abs(cent, 0);
			if(typeof isThousand === 'boolean') isThousand = isThousand ? '1' : '0';
			if(isNaN(isThousand)) isThousand = 0;
			isThousand = parseInt(isThousand, 0);
			if(isThousand < 0) isThousand = 0;
			if(isThousand >= 1) isThousand = 1;
			var sign = num == (num = Math.abs(num));
			num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);
			var cents = num % Math.pow(10, cent);
			num = Math.floor(num / Math.pow(10, cent)).toString();
			cents = cents.toString();
			while(cents.length < cent) cents = '0' + cents;
			sign = sign ? '' : '-';
			if(isThousand == 0) {
				return cent == 0 ? sign + num : sign + num + '.' + cents;
			}
			for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));

			return cent == 0 ? sign + num : sign + num + '.' + cents;
		},

		/**
		 * 获取中位数
		 */
		getMd: function(datas) {
			Ext.Array.sort(datas);
			var index = parseInt((datas.length + 1) / 2, 0);

			return datas[index];
		},

		/**
		 * 获取众数
		 */
		getMo: function(datas) {
			var countArray = [datas.length],
				val;
			for(var i = 0; i < datas.length; i++) {
				var num = 0;
				for(var j = 0; j < datas.length; j++) {
					if(datas[j] == datas[i]) num++;
				}
				countArray[i] = num;
			}
			var count = 0;
			for(var k = 0; k < countArray.length; k++) {
				if(countArray[k] > 1 && countArray[k] > count) {
					count = countArray[k];
					val = datas[i];
				}
			}

			return val;
		},

		/**
		 * 获取平方差
		 * @param {} datas 数据数组
		 * @param {} format 小数位 缺省：0.00
		 * @return {}
		 */
		getS2: function(datas, format) {
			format = format || '0.00';
			var m = Ext.Array.mean(datas);
			var val = 0,
				n = datas.length;
			for(var i = 0; i < n; i++) {
				var x = datas[i];
				val += Math.pow(x - m, 2);
			}

			return Ext.util.Format.number(val / n, format);
		},

		/**
		 * 获取标准差
		 * @param {} datas 数据数组
		 * @param {} format 小数位 缺省：0.00
		 * @return {}
		 */
		getSd: function(datas, format) {
			format = format || '0.00';
			var m = Ext.Array.mean(datas);
			var val = 0,
				n = datas.length;
			for(var i = 0; i < n; i++) {
				var x = datas[i];
				val += Math.pow(x - m, 2);
			}

			return Ext.util.Format.number(Math.sqrt(val / n), format);
		},

		/**
		 * 替换字符串
		 * @param {} str 字符串
		 * @param {} s1  替换字符串
		 * @param {} s2  替换为
		 * @return {}
		 */
		replaceAll: function(str, s1, s2) {
			return str.replace(new RegExp(s1, 'gm'), s2);
		},

		/**
		 * 获取数字型数据
		 * @param {} value
		 * @return {}
		 */
		getNumber: function(value) {
			return Ext.isNumber(value) ? value : isNaN(Number(value)) ? 0 : Number(value);
		},

		/**
		 * 获取随机颜色
		 * @return {}
		 */
		getRandomColor: function() {
			return '#' + ('00000' + (Math.random() * 16777215 + 0.5) >> 0).toString(16).slice(-6);
		},
		
		/**
		 * 获取当前客户端日期 精确到日期
		 * @return 日期格式(yyyy-MM-dd)
		 */
		getDate: function() {
			return CU.getDateTimeFormat(new Date(),"yyyy-MM-dd");
		},
		getBeforeDate:function(day){
			var date=CU.getDateBeforeDay(new Date(),day);
			return CU.getDateTimeFormat(date,"yyyy-MM-dd");
		},
		/**
		 * 获取当前客户端时间 精确到秒
		 * @return 时间格式(yyyy-MM-dd hh:mm:ss)
		 */
		getTime: function() {
			return CU.getDateTimeFormat(new Date(),"yyyy-MM-dd HH:mm:ss");
		},	
		getBeforeTime:function(day){
			var date=CU.getDateBeforeDay(new Date(),day);
			return CU.getDateTimeFormat(date,"yyyy-MM-dd HH:mm:ss");
		},
		/**
		 * 获取当前客户端时间 精确到分钟
		 * @return 时间格式(yyyy-MM-dd hh:mm)
		 */
		getTimeMinutes:function(){
			return CU.getDateTimeFormat(new Date(),"yyyy-MM-dd HH:mm");
		},
		getBeforeTimeMinutes:function(day){
			console.debug("getBeforeTimeMinutes:",day);
			var date=CU.getDateBeforeDay(new Date(),day);
			return CU.getDateTimeFormat(date,"yyyy-MM-dd 00:00");
		},
		
		/**
		 * 将日期转换为特定格式 支持：时间格式(yyyy-MM-dd hh:mm:ss)
		 * return fmt
		 */
		getDateTimeFormat(date, fmt) {			
			var o = {
				"M+": date.getMonth() + 1, //月份   
				"d+": date.getDate(), //日   
				"H+": date.getHours(), //小时   
				"m+": date.getMinutes(), //分   
				"s+": date.getSeconds(), //秒   
				"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
				"S": date.getMilliseconds() //毫秒   
			};
			if(/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		},

		/**
		 * 自动补全日期字符串格式
		 * @param {} value  2015=2015-01-01、2015-02 = 2015-02-01
		 * @return {}
		 */
		toDateStringSupply: function(value) {
			value = value + '';
			var length = value.length;
			value = length == 4 ? value += '-01-01' : length == 7 ? value += '-01' : value;

			return value;
		},

		/**
		 * 字符串转换为日期格式
		 * @param value 字符串数据(例如:2013-02-27)
		 * @return 日期对象
		 */
		toDate: function(value) {
			return new Date(CU.toDateStringSupply(value).replace(/-/g, '/'));
		},

		/**
		 * 日期转换为字符串
		 * @param date 日期
		 * @return 字符串日期(2013-02-27)
		 */
		toDateString: function(date) {
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			if(m < 10) m = '0' + m;
			var d = date.getDate();
			if(d < 10) d = '0' + d;

			return y + '-' + m + '-' + d;
		},

		/**
		 * 日期转换为字符串
		 * @param  date 日期
		 * @return 字符串时间(2013-02-27 17:10:00)
		 */
		toTimeString: function(date) {
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			if(m < 10) m = '0' + m;
			var d = date.getDate();
			if(d < 10) d = '0' + d;
			var h = date.getHours();
			if(h < 10) h = '0' + h;
			var mi = date.getMinutes();
			if(mi < 10) mi = '0' + mi;
			var s = date.getSeconds();
			if(s < 10) s = '0' + s;

			return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
		},

		/**
		 * 获取日期差异
		 * @param small  开始日期long
		 * @param big    结束日期long
		 * @return 天
		 */
		getDateDiff: function(small, big) {
			return(big - small) / 1000 / 60 / 60 / 24;
		},

		/**
		 * 几天以前的日期
		 * @param day 天数
		 * @return 日期对象
		 */
		getDateBeforeDay: function(date, day) {
			var d = date || new Date();
			return new Date(d.getTime() - 1000 * 60 * 60 * 24 * day);
		},
		/**
		 * 几天以前的日期
		 * @param day 天数
		 * @return 字符串(2013-02-27)
		 */
		/*getDateBeforeDayString: function(date, day) {
			date = CU.getDateBeforeDay(date, day);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var d = date.getDate();
			if(m < 10) m = '0' + m;
			if(d < 10) d = '0' + d;

			return y + '-' + m + '-' + d;
		},*/

		/**
		 * 几天以后的日期
		 * @param day 天数
		 * @return 日期对象
		 */
		getAfterDate: function(day) {
			return new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * day);
		},
		/**
		 * 几天某日期以后几天的日期
		 * @param data 日期对象
		 * @param day 天数
		 * @return 日期对象
		 */
		getAfterDate: function(date, day) {
			date = date || new Date();

			return new Date(date.getTime() + 1000 * 60 * 60 * 24 * day);
		},

		/**
		 * 几天以后的日期
		 * @param day 天数
		 * @return 字符串(2013-02-27)
		 */
		getAfterDateString: function(date, day) {
			var date = CU.getAfterDate(date, day);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var d = date.getDate();
			if(m < 10) m = '0' + m;
			if(d < 10) d = '0' + d;
			return y + '-' + m + '-' + d;
		},
		
		/**
		 * 获取某年某月的天数
		 * @param year 年份
		 * @param month 月份
		 * @return Number 天数
		 */
		getDaysInMonth: function(year, month) {
			switch(month) {
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12:
					return 31;
				case 4:
				case 6:
				case 9:
				case 11:
					return 30;
				case 2:
					return(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0) ? 29 : 28;
				default:
					return -1;
			}
		},

		/**
		 * 获取当前(指定)日期的月份
		 * @param  date 日期格式
		 * @return 字符串 (2013-03)
		 */
		getYearMonth: function(date) {
			date = Ext.isEmpty(date) ? date = new Date() : date;
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			if(m < 10) m = '0' + m;

			return y + '-' + m;
		},

		/**
		 * 获取指定日期几个月以后的时间
		 * @param  date 日期格式
		 * @param  count 月数
		 * @return 字符串 (2013-03)
		 */
		getAfterYearMonth: function(date, count) {
			date = Ext.isEmpty(date) ? date = new Date() : date;
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			count = Ext.isEmpty(count) ? 1 : count;
			m = m + count;
			if(m % 12 == 0) {
				y += m / 12 - 1;
				m = 12;
			} else if(m > 12) {
				y += parseInt(m / 12, 0);
				m = m % 12;
			}
			if(m < 10) m = '0' + m;

			return y + '-' + m;
		},

		/**
		 * 获取指定日期几个月以前的时间
		 * @param  date  日期格式
		 * @param  count 月数
		 * @return 字符串 (2013-03)
		 */
		getBeforeYearMonth: function(date, count) {
			date = Ext.isEmpty(date) ? date = new Date() : date;
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var sum = (y * 12 + m) - count;
			if(sum % 12 == 0) {
				y = parseInt(sum / 12, 0) - 1;
				m = 12;
			} else {
				y = parseInt(sum / 12, 0);
				m = sum % 12;
			}
			if(m < 10) m = '0' + m;

			return y + '-' + m;
		},

		/**
		 * 根据文件类型获取iconCls图标
		 * @param {} v
		 * @return {}
		 */
		getFileTypeIconCls: function(v) {
			var iconCls = 'x-fa fa-file';
			v = Ext.isEmpty(v) ? '' : v;
			switch(v.toUpperCase()) {
				case 'DOC':
				case 'DOCX':
					iconCls = 'x-fa fa-file-word-o';
					break;
				case 'TXT':
					iconCls = 'x-fa fa-file-text';
					break;
				case 'PDF':
					iconCls = 'x-fa fa-file-pdf-o';
					break;
				case 'MP3':
					iconCls = 'x-fa fa-file-audio-o';
					break;
				case 'XLS':
				case 'XLSX':
					iconCls = 'x-fa fa-file-excel-o';
					break;
				case 'ZIP':
				case 'RAR':
					iconCls = 'x-fa fa-file-archive-o';
					break;
				case 'JPG':
				case 'GIF':
				case 'PNG':
					iconCls = 'x-fa fa-file-image-o';
					break;
				default:
			}

			return iconCls;
		},

		/**
		 * 获取文件后侧名
		 * @param {} file
		 * @return {}
		 */
		getFileSuffix: function(file) {
			if(Ext.isEmpty(file)) return '';
			var beginIndex = file.lastIndexOf('.');

			return file.substring(beginIndex + 1, file.length);
		},

		/**
		 * 递归读取全部数据
		 * @param {} datas  数据集合
		 * @param {} callback  回调方法
		 * @param {} scope
		 * @param {} childname  子节点名称 缺省children
		 */
		eachChild: function(datas, callback, scope, childname) {
			scope = scope || this;
			var child = childname || 'children';
			var nextChildNode = function(nodes) {
				Ext.each(nodes, function(data) {
					Ext.callback(callback, scope, [data]);
					var children = data[child];
					if(Ext.isArray(children) && children.length > 0) {
						nextChildNode(children, callback, scope, child);
					}
				});
			};
			nextChildNode(datas, callback, scope, child);
		},
		/**
		 * 将朱单/分单/邮件单转换为数组
		 * 主单格式：AWBA99912312300->999-12312300
		 * 分单格式：AWBH99912312300
		 * @param {Object} billid 运单
		 */
		convertBillId2Array: function(billid) {
			try {
				var tempPrefix=billid.substr(0,4);
				var othersType=['AWBW','AWBS','AWBD'];
				//'AWBC','AWBM'
				var arr = [];
				if(Ext.isEmpty(billid)) return '';
				if(tempPrefix=="AWBA") {
					arr[0] = tempPrefix;
					arr[1] = billid.substr(4, 3);
					arr[2] = billid.substr(7, 8);

					return arr;
				}
				else if(tempPrefix=="AWBH") {
					arr[0] = tempPrefix;
					arr[1] = billid.substr(4, 11);
					arr[2] = billid.substr(15);
					return arr;
				}
				else if(othersType.indexOf(tempPrefix)!=-1){
					arr[0] = tempPrefix;
					arr[1] = billid.substr(4, 7);
					arr[2] = billid.substr(7);
					return arr;
				}
				else if('AWBC'==tempPrefix){
					arr[0] = tempPrefix;
					arr[1] = billid.substr(4, 10);
					arr[2] = billid.substr(10);
					return arr;
				}
				else if('AWBM'==tempPrefix){
					var num = billid.substr(4);
					if (num.indexOf("/")!=-1 && num.indexOf("-")!=-1) {
						arr[1] = billid.substr(4, num.length -3);
						arr[2] = billid.substr(num.length -3);
					}else {
						arr[1] = billid.substr(4, 6);
						arr[2] = billid.substr(6);
					}
					arr[0] = tempPrefix;
					return arr;
				}
				return ['', ''];
				/*arr[0] = tempPrefix;
				// 判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
				 var re = /^([0-9]+.?[0-9]*)/;
				    if(!prefix) {
				        prefix = 2;
				    } else {
				        prefix = prefix.length;
				    } 
				//prefix = 2;
				arr[1] = billid.substr(4, prefix);
				arr[2] = billid.substr(6);

				return arr;*/

			} catch(e) {
				return ['', ''];
			}
		},
		/**
		 * 将朱单/分单/邮件单转换为数组
		 * 主单格式：AWBA99912312300->999-12312300
		 * 分单格式：AWBH99912312300
		 * @param {Object} billid
		 * @param {Object} prefix
		 */
		convertBillId: function(billid) {
			var arr = CU.convertBillId2Array(billid);
			if(arr.length == 2) {
				return arr[1];
			}
			return arr[1] + '-' + arr[2];
		},
		/**
		 * 计算两个浮点型数字累加，自动取最大的精度小数
		 */
		calculateFloatPrecision: function(number1, number2) {
			var str1 = String(number1);
			var str2 = String(number2);

			var fixedLength1 = str1.substring(str1.indexOf(".") + 1).length;
			var fixedLength2 = str2.substring(str2.indexOf(".") + 1).length;
			var total = parseFloat(Number(number1) + Number(number2));
			total = Number(total.toFixed(fixedLength2 > fixedLength1 ? fixedLength2 : fixedLength1));
			return total;
		},
		/**
		 * 设定新日期
		 * @param x 加减月份
		*/			
		 getBeforeDateMonth:function(x){
			var d = new Date();
	        d.setMonth(d.getMonth()-x);
	        var y = d.getFullYear();
	        var m = d.getMonth()+1;
	        var d = d.getDate();
	        if(m < 10) m = '0' + m;
	        if(d < 10) d = '0' + d;
			var newdate=y+"-"+m+"-"+d
		    return newdate;
		}
	}
});