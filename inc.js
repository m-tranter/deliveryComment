!(function r(e, n, t) {
  function o(i, f) {
    if (!n[i]) {
      if (!e[i]) {
        var c = "function" == typeof require && require;
        if (!f && c) return c(i, !0);
        if (u) return u(i, !0);
        throw (
          (((f = new Error("Cannot find module '" + i + "'")).code =
            "MODULE_NOT_FOUND"),
          f)
        );
      }
      (c = n[i] = { exports: {} }),
        e[i][0].call(
          c.exports,
          function (r) {
            return o(e[i][1][r] || r);
          },
          c,
          c.exports,
          r,
          e,
          n,
          t
        );
    }
    return n[i].exports;
  }
  for (
    var u = "function" == typeof require && require, i = 0;
    i < t.length;
    i++
  )
    o(t[i]);
  return o;
})(
  {
    1: [
      function (require, module, exports) {
        // Anything you want your app to do goes in this Immediately Executed Function.
        (async function loadEntries() {
          const rx_iso_date =
            /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?(?:\.\d*)?Z?$/;
          const myComment = document.getElementById("comment");
          const myDisplay = document.getElementById("display");
          const myBtn = document.getElementById("myBtn");
          const { Client } = require("contensis-delivery-api");
          const myTable = document.getElementById("myTable");
          const dateField = document.getElementById("dateField");
          const commentField = document.getElementById("commentField");
          myBtn.addEventListener("click", sendComment);
          myComment.addEventListener("focus", clear);
          setUp(commentField, "myComment");
          setUp(dateField, "dateAndTime");
          var k = 1;
          var j = 1;
          var items = [];
          let config = {
            rootUrl: "https://cms-chesheast.cloud.contensis.com/",
            accessToken: "QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I",
            projectId: "website",
            language: "en-GB",
            versionStatus: "published",
            pageSize: 50,
          };
          let client = Client.create(config);
          let res = await client.entries.list({
            contentTypeId: "testComment",
            pageOptions: { pageIndex: 0, pageSize: 10 },
            orderBy: ["sys.id"],
          });
          items = JSON.parse(
            JSON.stringify(res.items.slice()),
            (key, value) => {
              return typeof value === "string" && value.match(rx_iso_date)
                ? new Date(value)
                : value;
            }
          );
          items.sort(sortNum("dateAndTime", 1));
          items.forEach((item) => {
            addRow(item);
          });

          function setUp(e, f) {
            e.addEventListener("click", () => sortByField(f));
            e.addEventListener(
              "mouseover",
              () => (e.style.backgroundColor = "LightGreen")
            );
            e.addEventListener(
              "mouseout",
              () => (e.style.backgroundColor = "White")
            );
          }

          function sortByField(f) {
            if (f === "myComment") {
              items.sort(sortObjStr(f, -1));
            } else {
              items.sort(sortNum(f, -1));
            }
            clearTable();
            items.forEach((item) => {
              addRow(item);
            });
          }

          function clearTable() {
            items.forEach(() => {
              myTable.deleteRow(1);
            });
          }

          function addRow(item) {
            let row = myTable.insertRow(1);
            let date = row.insertCell(0);
            let comment = row.insertCell(1);
            date.innerHTML = item.dateAndTime.toLocaleDateString();
            comment.innerHTML = item.myComment;
          }

          function clear() {
            myDisplay.innerHTML = "&nbsp;";
          }

          function sortObjStr(field, op) {
            k *= op;
            return (a, b) => {
              let x = a[field].toLowerCase();
              let y = b[field].toLowerCase();
              if (x < y) {
                return -1 * k;
              }
              if (x > y) {
                return 1 * k;
              }
              return 0;
            };
          }

          function sortNum(field, op) {
            j *= op;
            return (a, b) => {
              return (a[field] - b[field]) * j;
            };
          }

          function sendComment() {
            let msg = myComment.value;
            if (!msg) {
              return;
            }
            myComment.value = "";
            myBtn.disabled = true;
            myDisplay.innerText = "Contacting the server.";
            let myDate = new Date().toLocaleString();
            fetch(
              "https://cors-pnbi.onrender.com/https://managementapi.onrender.com/comment",
              {
                method: "post",
                body: JSON.stringify({ comment: msg, date: myDate }),
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                },
              }
            )
              .then((response) => {
                if (response.status === 200) {
                  console.log("Success.");
                  myDisplay.innerText = `We received your comment:\n"${msg}"`;
                } else {
                  myDisplay.innerText = "Something went wrong.";
                  throw Error("Server rejected comment.");
                }
              })
              .catch((err) => console.log(err));
            myBtn.disabled = false;
          }
        })();
      },
      { "contensis-delivery-api": 26 },
    ],
    2: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var utils_1 = require("../utils"),
          require = (function () {
            function HttpClient(paramsProvider, fetchFn) {
              (this.paramsProvider = paramsProvider), (this.fetchFn = fetchFn);
            }
            return (
              (HttpClient.prototype.request = function (url, request) {
                void 0 === request && (request = {});
                var params = this.paramsProvider.getParams(),
                  isRelativeRequestUrl =
                    !params.rootUrl || "/" === params.rootUrl;
                if (!utils_1.isBrowser() && isRelativeRequestUrl)
                  throw new Error(
                    "You cannot specify a relative root url if not in a browser context."
                  );
                (request.method =
                  request.method || (request.body ? "POST" : "GET")),
                  isRelativeRequestUrl || (request.mode = "cors"),
                  (request.headers = request.headers || {});
                var headers = request.headers;
                if (
                  (!headers.accessToken &&
                    params.accessToken &&
                    (headers.accessToken = params.accessToken),
                  "none" === params.clientType && !headers.accessToken)
                )
                  throw new Error(
                    'If the property clientType is set to "' +
                      params.clientType +
                      '" then the property accessToken must be provided.'
                  );
                if (
                  "client_credentials" === params.clientType &&
                  !params.clientDetails
                )
                  throw new Error(
                    'If the property client type is set to "' +
                      params.clientType +
                      '" then the property clientDetails must be set to a ClientCredentialsGrant value.'
                  );
                params.defaultHeaders &&
                  Object.keys(params.defaultHeaders).forEach(function (key) {
                    !headers[key] &&
                      params.defaultHeaders[key] &&
                      (headers[key] = params.defaultHeaders[key]);
                  });
                isRelativeRequestUrl = isRelativeRequestUrl
                  ? "" + url
                  : "" + params.rootUrl + url;
                return this.fetchFn(isRelativeRequestUrl, request)
                  .then(function (response) {
                    var responseHandlerFunction = null,
                      responseContext =
                        (params.responseHandler &&
                          (params.responseHandler["*"] &&
                            (responseHandlerFunction =
                              params.responseHandler["*"]),
                          params.responseHandler[response.status] &&
                            (responseHandlerFunction =
                              params.responseHandler[response.status])),
                        {
                          status: response.status,
                          statusText: response.statusText,
                          url: response.url,
                          data: null,
                        });
                    return response
                      .text()
                      .then(function (text) {
                        return text && text.length && 0 < text.length
                          ? JSON.parse(text)
                          : {};
                      })
                      .then(
                        function (result) {
                          return (
                            (responseContext.data = result),
                            response.ok
                              ? (responseHandlerFunction &&
                                  responseHandlerFunction(
                                    response,
                                    responseContext
                                  ),
                                result)
                              : responseHandlerFunction
                              ? responseHandlerFunction(
                                  response,
                                  responseContext
                                )
                              : Promise.reject(responseContext)
                          );
                        },
                        function (reason) {
                          return (
                            (responseContext.data = reason),
                            responseHandlerFunction
                              ? responseHandlerFunction(
                                  response,
                                  responseContext
                                )
                              : Promise.reject(responseContext)
                          );
                        }
                      );
                  })
                  .then(function (result) {
                    return result;
                  });
              }),
              HttpClient
            );
          })();
        exports.HttpClient = require;
      },
      { "../utils": 20 },
    ],
    3: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var tslib_1 = require("tslib");
        tslib_1.__exportStar(require("./http-client"), exports),
          tslib_1.__exportStar(require("./url-builder"), exports);
      },
      { "./http-client": 2, "./url-builder": 4, tslib: 32 },
    ],
    4: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var tslib_1 = require("tslib"),
          utils_1 = require("../utils"),
          require = (function () {
            function UrlBuilder(url, query) {
              (this.url = url),
                (this.query = query),
                (this.paramMatcher = /(:\b\D\w*)/g),
                (this.options = {}),
                (this.mappers = {});
            }
            return (
              (UrlBuilder.create = function (url, query) {
                return new UrlBuilder(
                  url,
                  (query = void 0 === query ? null : query)
                );
              }),
              (UrlBuilder.prototype.addOptions = function (
                options,
                defaultParamName
              ) {
                return (
                  void 0 === defaultParamName && (defaultParamName = null),
                  utils_1.isString(options) && defaultParamName
                    ? (this.options[defaultParamName] = options)
                    : (this.options = tslib_1.__assign(
                        {},
                        this.options,
                        options
                      )),
                  this
                );
              }),
              (UrlBuilder.prototype.setParams = function (clientParams) {
                return (this.clientParams = clientParams), this;
              }),
              (UrlBuilder.prototype.addMappers = function (mappers) {
                var _this = this;
                return (
                  mappers &&
                    Object.keys(mappers).forEach(function (key) {
                      _this.mappers[key] = mappers[key];
                    }),
                  this
                );
              }),
              (UrlBuilder.prototype.toUrl = function () {
                var _this = this,
                  namedParams = {},
                  urlTemplate =
                    "function" == typeof this.url
                      ? this.url(this.options, this.clientParams)
                      : this.url,
                  paramNames = urlTemplate.match(this.paramMatcher),
                  query =
                    (paramNames &&
                      paramNames.forEach(function (paramName) {
                        var key = paramName.substring(1),
                          value = null,
                          key =
                            (utils_1.hasProp(_this.options, key) &&
                            null !== _this.options[key]
                              ? (value = _this.options[key])
                              : utils_1.hasProp(_this.clientParams, key) &&
                                null !== _this.clientParams[key] &&
                                (value = _this.clientParams[key]),
                            null);
                        _this.mappers[paramName] &&
                          (key = _this.mappers[paramName](
                            value,
                            _this.options,
                            _this.clientParams
                          )),
                          (namedParams[paramName] = null !== key ? key : value);
                      }),
                    {});
                return (
                  this.query &&
                    ((query = tslib_1.__assign({}, this.query)),
                    Object.keys(this.query).forEach(function (paramName) {
                      var value = query[paramName];
                      utils_1.hasProp(_this.options, paramName) &&
                      null !== _this.options[paramName]
                        ? (value = _this.options[paramName])
                        : utils_1.hasProp(_this.clientParams, paramName) &&
                          null !== _this.clientParams[paramName] &&
                          (value = _this.clientParams[paramName]),
                        (query[paramName] = _this.mappers[paramName]
                          ? _this.mappers[paramName](
                              value,
                              _this.options,
                              _this.clientParams
                            )
                          : value);
                    })),
                  "" +
                    Object.keys(namedParams).reduce(function (url, key) {
                      return url.replace(key, namedParams[key]);
                    }, urlTemplate) +
                    utils_1.toQuery(query)
                );
              }),
              UrlBuilder
            );
          })();
        exports.UrlBuilder = require;
      },
      { "../utils": 20, tslib: 32 },
    ],
    5: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var tslib_1 = require("tslib");
        tslib_1.__exportStar(require("./http"), exports),
          tslib_1.__exportStar(require("./models"), exports),
          tslib_1.__exportStar(require("./utils"), exports);
      },
      { "./http": 3, "./models": 7, "./utils": 20, tslib: 32 },
    ],
    6: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var tslib_1 = require("tslib"),
          require = (function (_super) {
            function ContensisApplicationError(message) {
              var _newTarget = this.constructor,
                message = _super.call(this, message) || this;
              return (
                (message.name = "ContensisApplicationError"),
                Object.setPrototypeOf(message, _newTarget.prototype),
                message
              );
            }
            return (
              tslib_1.__extends(ContensisApplicationError, _super),
              ContensisApplicationError
            );
          })(Error),
          require =
            ((exports.ContensisApplicationError = require),
            (function (_super) {
              function ContensisAuthenticationError(message) {
                var _newTarget = this.constructor,
                  message = _super.call(this, message) || this;
                return (
                  (message.name = "ContensisAuthenticationError"),
                  Object.setPrototypeOf(message, _newTarget.prototype),
                  message
                );
              }
              return (
                tslib_1.__extends(ContensisAuthenticationError, _super),
                ContensisAuthenticationError
              );
            })(Error));
        exports.ContensisAuthenticationError = require;
      },
      { tslib: 32 },
    ],
    7: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var tslib_1 = require("tslib");
        tslib_1.__exportStar(require("./errors"), exports),
          tslib_1.__exportStar(require("./search"), exports);
      },
      { "./errors": 6, "./search": 19, tslib: 32 },
    ],
    8: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ExpressionValueTypeEnum = {
            Single: "single",
            Array: "array",
            Unknown: "unknown",
          });
      },
      {},
    ],
    9: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FreeTextSearchOperatorTypeEnum = { And: "and", Or: "or" });
      },
      {},
    ],
    10: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var Operators_1 = require("./Operators"),
          QueryTypes_1 = require("./QueryTypes"),
          require = (function () {
            function ManagementQuery() {
              for (
                var whereExpressions = [], _i = 0;
                _i < arguments.length;
                _i++
              )
                whereExpressions[_i] = arguments[_i];
              (this.where = new Operators_1.WhereExpression()),
                (this.orderBy = []),
                (this.pageIndex = 0),
                (this.pageSize = 20),
                (this.includeArchived = !1),
                (this.includeDeleted = !1),
                whereExpressions && this.where.addRange(whereExpressions);
            }
            return (
              (ManagementQuery.prototype.toJSON = function () {
                var result = {},
                  orderByDtos =
                    ((result.pageIndex = this.pageIndex),
                    (result.pageSize = this.pageSize),
                    QueryTypes_1.serializeOrder(this.orderBy));
                return (
                  orderByDtos &&
                    0 < orderByDtos.length &&
                    (result.orderBy = orderByDtos),
                  (result.where = this.where),
                  (result.includeArchived = this.includeArchived),
                  (result.includeDeleted = this.includeDeleted),
                  result
                );
              }),
              ManagementQuery
            );
          })();
        exports.ManagementQuery = require;
      },
      { "./Operators": 13, "./QueryTypes": 17 },
    ],
    11: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var ManagementZenqlQuery = (function () {
          function ManagementZenqlQuery(zenql) {
            (this.zenql = ""),
              (this.pageIndex = 0),
              (this.pageSize = 20),
              (this.includeArchived = !1),
              (this.includeDeleted = !1),
              (this.zenql = zenql);
          }
          return (
            (ManagementZenqlQuery.prototype.toJSON = function () {
              var result = {};
              return (
                (result.pageIndex = this.pageIndex),
                (result.pageSize = this.pageSize),
                (result.zenql = this.zenql),
                (result.includeArchived = this.includeArchived),
                (result.includeDeleted = this.includeDeleted),
                result
              );
            }),
            ManagementZenqlQuery
          );
        })();
        exports.ManagementZenqlQuery = ManagementZenqlQuery;
      },
      {},
    ],
    12: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.OperatorTypeEnum = {
            And: "and",
            Between: "between",
            Contains: "contains",
            EndsWith: "endsWith",
            EqualTo: "equalTo",
            Exists: "exists",
            FreeText: "freeText",
            GreaterThan: "greaterThan",
            GreaterThanOrEqualTo: "greaterThanOrEqualTo",
            In: "in",
            LessThan: "lessThan",
            LessThanOrEqualTo: "lessThanOrEqualTo",
            Not: "not",
            Or: "or",
            StartsWith: "startsWith",
            Where: "where",
            DistanceWithin: "distanceWithin",
          });
      },
      {},
    ],
    13: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var tslib_1 = require("tslib"),
          __1 = require(".."),
          FreeTextSearchOperatorType_1 = require("./FreeTextSearchOperatorType"),
          require = (function () {
            function ExpressionBase(
              fieldName,
              values,
              operatorName,
              valueType
            ) {
              void 0 === values && (values = []),
                (this.fieldName = fieldName),
                (this.values = values),
                (this.operatorName = operatorName),
                (this.valueType = valueType),
                (this._weight = 0);
            }
            return (
              (ExpressionBase.prototype.addValue = function (value) {
                return (this.values[this.values.length] = value), this;
              }),
              (ExpressionBase.prototype.weight = function (weight) {
                return (this._weight = weight), this;
              }),
              (ExpressionBase.prototype.toJSON = function () {
                var result = {};
                return (
                  this.fieldName && (result.field = this.fieldName),
                  this.valueType === __1.ExpressionValueTypeEnum.Single ||
                  (this.valueType !== __1.ExpressionValueTypeEnum.Array &&
                    this.values &&
                    1 === this.values.length)
                    ? (result[this.operatorName] = this.values[0])
                    : (result[this.operatorName] = this.values),
                  this._weight &&
                    1 < this._weight &&
                    (result.weight = this._weight),
                  result
                );
              }),
              ExpressionBase
            );
          })(),
          LogicalExpression = (function (_super) {
            function LogicalExpression(values, operatorName, valueType) {
              return (
                _super.call(
                  this,
                  null,
                  (values = void 0 === values ? [] : values),
                  operatorName,
                  __1.ExpressionValueTypeEnum.Array
                ) || this
              );
            }
            return (
              tslib_1.__extends(LogicalExpression, _super),
              (LogicalExpression.prototype.getItem = function (index) {
                return this.values[index];
              }),
              (LogicalExpression.prototype.setItem = function (index, item) {
                return (this.values[index] = item), this;
              }),
              (LogicalExpression.prototype.add = function (item) {
                return (this.values[this.values.length] = item), this;
              }),
              (LogicalExpression.prototype.addRange = function (items) {
                return Array.prototype.push.apply(this.values, items), this;
              }),
              (LogicalExpression.prototype.indexOf = function (item) {
                return this.values.indexOf(item);
              }),
              (LogicalExpression.prototype.insert = function (index, item) {
                return this.values.splice(index, 0, item), this;
              }),
              (LogicalExpression.prototype.remove = function (item) {
                item = this.indexOf(item);
                return 0 <= item && (this.removeAt(item), !0);
              }),
              (LogicalExpression.prototype.removeAt = function (index) {
                return this.values.splice(index, 1), this;
              }),
              (LogicalExpression.prototype.clear = function () {
                return (this.values.length = 0), this;
              }),
              (LogicalExpression.prototype.contains = function (item) {
                return 0 <= this.indexOf(item);
              }),
              (LogicalExpression.prototype.count = function () {
                return this.values.length;
              }),
              LogicalExpression
            );
          })((exports.ExpressionBase = require)),
          AndExpression = (function (_super) {
            function AndExpression(values) {
              return (
                _super.call(
                  this,
                  values,
                  __1.OperatorTypeEnum.And,
                  __1.ExpressionValueTypeEnum.Array
                ) || this
              );
            }
            return tslib_1.__extends(AndExpression, _super), AndExpression;
          })((exports.LogicalExpression = LogicalExpression)),
          BetweenExpression = (function (_super) {
            function BetweenExpression(fieldName, minimum, maximum) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [minimum, maximum],
                  __1.OperatorTypeEnum.Between,
                  __1.ExpressionValueTypeEnum.Array
                ) || this
              );
            }
            return (
              tslib_1.__extends(BetweenExpression, _super), BetweenExpression
            );
          })(require),
          ContainsExpression = (function (_super) {
            function ContainsExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.Contains,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(ContainsExpression, _super), ContainsExpression
            );
          })(require),
          DistanceWithinExpression = (function (_super) {
            function DistanceWithinExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.DistanceWithin,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(DistanceWithinExpression, _super),
              DistanceWithinExpression
            );
          })(require),
          EndsWithExpression = (function (_super) {
            function EndsWithExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.EndsWith,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(EndsWithExpression, _super), EndsWithExpression
            );
          })(require),
          EqualToExpression = (function (_super) {
            function EqualToExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.EqualTo,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(EqualToExpression, _super), EqualToExpression
            );
          })(require),
          ExistsExpression = (function (_super) {
            function ExistsExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.Exists,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(ExistsExpression, _super), ExistsExpression
            );
          })(require),
          FreeTextExpression = (function (_super) {
            function FreeTextExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.FreeText,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(FreeTextExpression, _super), FreeTextExpression
            );
          })(require),
          GreaterThanExpression = (function (_super) {
            function GreaterThanExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.GreaterThan,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(GreaterThanExpression, _super),
              GreaterThanExpression
            );
          })(require),
          GreaterThanOrEqualToExpression = (function (_super) {
            function GreaterThanOrEqualToExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.GreaterThanOrEqualTo,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(GreaterThanOrEqualToExpression, _super),
              GreaterThanOrEqualToExpression
            );
          })(require),
          InExpression = (function (_super) {
            function InExpression(fieldName, values) {
              return (
                _super.call(
                  this,
                  fieldName,
                  values,
                  __1.OperatorTypeEnum.In,
                  __1.ExpressionValueTypeEnum.Array
                ) || this
              );
            }
            return tslib_1.__extends(InExpression, _super), InExpression;
          })(require),
          LessThanExpression = (function (_super) {
            function LessThanExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.LessThan,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(LessThanExpression, _super), LessThanExpression
            );
          })(require),
          LessThanOrEqualToExpression = (function (_super) {
            function LessThanOrEqualToExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.LessThanOrEqualTo,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(LessThanOrEqualToExpression, _super),
              LessThanOrEqualToExpression
            );
          })(require),
          NotExpression = (function (_super) {
            function NotExpression(value) {
              return (
                _super.call(
                  this,
                  [value],
                  __1.OperatorTypeEnum.Not,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return tslib_1.__extends(NotExpression, _super), NotExpression;
          })(LogicalExpression),
          OrExpression = (function (_super) {
            function OrExpression(values) {
              return (
                _super.call(
                  this,
                  values,
                  __1.OperatorTypeEnum.Or,
                  __1.ExpressionValueTypeEnum.Array
                ) || this
              );
            }
            return tslib_1.__extends(OrExpression, _super), OrExpression;
          })(LogicalExpression),
          StartsWithExpression = (function (_super) {
            function StartsWithExpression(fieldName, value) {
              return (
                _super.call(
                  this,
                  fieldName,
                  [value],
                  __1.OperatorTypeEnum.StartsWith,
                  __1.ExpressionValueTypeEnum.Single
                ) || this
              );
            }
            return (
              tslib_1.__extends(StartsWithExpression, _super),
              StartsWithExpression
            );
          })(require),
          require = (function (_super) {
            function WhereExpression(values) {
              return (
                _super.call(
                  this,
                  (values = void 0 === values ? [] : values),
                  __1.OperatorTypeEnum.Where,
                  __1.ExpressionValueTypeEnum.Array
                ) || this
              );
            }
            return (
              tslib_1.__extends(WhereExpression, _super),
              (WhereExpression.prototype.toJSON = function () {
                return _super.prototype.toJSON.call(this)[
                  __1.OperatorTypeEnum.Where
                ];
              }),
              WhereExpression
            );
          })(LogicalExpression),
          LogicalExpression =
            ((exports.WhereExpression = require),
            (function () {
              function Operators() {}
              return (
                (Operators.prototype.and = function () {
                  for (var values = [], _i = 0; _i < arguments.length; _i++)
                    values[_i] = arguments[_i];
                  return new AndExpression(values);
                }),
                (Operators.prototype.between = function (
                  name,
                  minimum,
                  maximum
                ) {
                  return new BetweenExpression(name, minimum, maximum);
                }),
                (Operators.prototype.contains = function (name, value) {
                  return new ContainsExpression(name, value);
                }),
                (Operators.prototype.distanceWithin = function (
                  name,
                  lat,
                  lon,
                  distance
                ) {
                  return new DistanceWithinExpression(name, {
                    lat: lat,
                    lon: lon,
                    distance: distance,
                  });
                }),
                (Operators.prototype.endsWith = function (name, value) {
                  return new EndsWithExpression(name, value);
                }),
                (Operators.prototype.equalTo = function (name, value) {
                  return new EqualToExpression(name, value);
                }),
                (Operators.prototype.exists = function (name, value) {
                  return new ExistsExpression(name, value);
                }),
                (Operators.prototype.freeText = function (
                  name,
                  term,
                  fuzzy,
                  operator
                ) {
                  return (
                    void 0 === operator &&
                      (operator =
                        FreeTextSearchOperatorType_1
                          .FreeTextSearchOperatorTypeEnum.And),
                    new FreeTextExpression(name, {
                      term: term,
                      fuzzy: (fuzzy = void 0 === fuzzy ? !1 : fuzzy),
                      operator: operator,
                    })
                  );
                }),
                (Operators.prototype.greaterThan = function (name, value) {
                  return new GreaterThanExpression(name, value);
                }),
                (Operators.prototype.greaterThanOrEqualTo = function (
                  name,
                  value
                ) {
                  return new GreaterThanOrEqualToExpression(name, value);
                }),
                (Operators.prototype.in = function (name) {
                  for (var values = [], _i = 1; _i < arguments.length; _i++)
                    values[_i - 1] = arguments[_i];
                  return new InExpression(name, values);
                }),
                (Operators.prototype.lessThan = function (name, value) {
                  return new LessThanExpression(name, value);
                }),
                (Operators.prototype.lessThanOrEqualTo = function (
                  name,
                  value
                ) {
                  return new LessThanOrEqualToExpression(name, value);
                }),
                (Operators.prototype.not = function (expression) {
                  return new NotExpression(expression);
                }),
                (Operators.prototype.or = function () {
                  for (var values = [], _i = 0; _i < arguments.length; _i++)
                    values[_i] = arguments[_i];
                  return new OrExpression(values);
                }),
                (Operators.prototype.startsWith = function (name, value) {
                  return new StartsWithExpression(name, value);
                }),
                Operators
              );
            })());
        exports.Operators = LogicalExpression;
      },
      { "..": 7, "./FreeTextSearchOperatorType": 9, tslib: 32 },
    ],
    14: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var Ordering_1 = require("./Ordering"),
          require = (function () {
            function OrderByFactory() {}
            return (
              (OrderByFactory.prototype.asc = function (fieldName) {
                return new Ordering_1.Ordering().asc(fieldName);
              }),
              (OrderByFactory.prototype.desc = function (fieldName) {
                return new Ordering_1.Ordering().desc(fieldName);
              }),
              OrderByFactory
            );
          })();
        exports.OrderByFactory = require;
      },
      { "./Ordering": 15 },
    ],
    15: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var Ordering = (function () {
          function Ordering() {
            this._items = [];
          }
          return (
            (Ordering.prototype.asc = function (fieldName) {
              return this._items.push({ asc: fieldName }), this;
            }),
            (Ordering.prototype.desc = function (fieldName) {
              return this._items.push({ desc: fieldName }), this;
            }),
            (Ordering.prototype.toArray = function () {
              return this._items;
            }),
            Ordering
          );
        })();
        exports.Ordering = Ordering;
      },
      {},
    ],
    16: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var Operators_1 = require("./Operators"),
          QueryTypes_1 = require("./QueryTypes"),
          require = (function () {
            function Query() {
              for (
                var whereExpressions = [], _i = 0;
                _i < arguments.length;
                _i++
              )
                whereExpressions[_i] = arguments[_i];
              (this.where = new Operators_1.WhereExpression()),
                (this.orderBy = []),
                (this.pageIndex = 0),
                (this.pageSize = 20),
                (this.fields = []),
                whereExpressions && this.where.addRange(whereExpressions);
            }
            return (
              (Query.prototype.toJSON = function () {
                var result = {},
                  orderByDtos =
                    ((result.pageIndex = this.pageIndex),
                    (result.pageSize = this.pageSize),
                    QueryTypes_1.serializeOrder(this.orderBy));
                return (
                  orderByDtos &&
                    0 < orderByDtos.length &&
                    (result.orderBy = orderByDtos),
                  (result.where = this.where),
                  this.fields &&
                    0 < this.fields.length &&
                    (result.fields = this.fields),
                  result
                );
              }),
              Query
            );
          })();
        exports.Query = require;
      },
      { "./Operators": 13, "./QueryTypes": 17 },
    ],
    17: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var Operators_1 = require("./Operators"),
          OrderByFactory_1 = require("./OrderByFactory"),
          Ordering_1 = require("./Ordering");
        function toOrderByDto(value) {
          var firstChar, _a;
          return value
            ? "string" == typeof value
              ? "+" === (firstChar = value.substring(0, 1)) || "-" === firstChar
                ? (((_a = {})["-" === firstChar ? "desc" : "asc"] =
                    value.substring(1)),
                  _a)
                : { asc: value }
              : value
            : null;
        }
        (exports.Op = new Operators_1.Operators()),
          (exports.OrderBy = new OrderByFactory_1.OrderByFactory()),
          (exports.serializeOrder = function (orderBy) {
            var o;
            return orderBy
              ? "string" == typeof orderBy
                ? (o = toOrderByDto(orderBy))
                  ? [o]
                  : []
                : Array.isArray(orderBy)
                ? orderBy.map(toOrderByDto).filter(function (o) {
                    return !!o;
                  })
                : null ===
                  (o = orderBy instanceof Ordering_1.Ordering ? orderBy : null)
                ? []
                : o.toArray()
              : [];
          });
      },
      { "./Operators": 13, "./OrderByFactory": 14, "./Ordering": 15 },
    ],
    18: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var ZenqlQuery = (function () {
          function ZenqlQuery(zenql) {
            (this.zenql = ""),
              (this.pageIndex = 0),
              (this.pageSize = 20),
              (this.fields = []),
              (this.zenql = zenql);
          }
          return (
            (ZenqlQuery.prototype.toJSON = function () {
              var result = {};
              return (
                (result.pageIndex = this.pageIndex),
                (result.pageSize = this.pageSize),
                (result.zenql = this.zenql),
                this.fields &&
                  0 < this.fields.length &&
                  (result.fields = this.fields),
                result
              );
            }),
            ZenqlQuery
          );
        })();
        exports.ZenqlQuery = ZenqlQuery;
      },
      {},
    ],
    19: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var tslib_1 = require("tslib");
        tslib_1.__exportStar(require("./ExpressionValueType"), exports),
          tslib_1.__exportStar(
            require("./FreeTextSearchOperatorType"),
            exports
          ),
          tslib_1.__exportStar(require("./ManagementQuery"), exports),
          tslib_1.__exportStar(require("./ManagementZenqlQuery"), exports),
          tslib_1.__exportStar(require("./Operators"), exports),
          tslib_1.__exportStar(require("./OperatorType"), exports),
          tslib_1.__exportStar(require("./Query"), exports),
          tslib_1.__exportStar(require("./QueryTypes"), exports),
          tslib_1.__exportStar(require("./ZenqlQuery"), exports);
      },
      {
        "./ExpressionValueType": 8,
        "./FreeTextSearchOperatorType": 9,
        "./ManagementQuery": 10,
        "./ManagementZenqlQuery": 11,
        "./OperatorType": 12,
        "./Operators": 13,
        "./Query": 16,
        "./QueryTypes": 17,
        "./ZenqlQuery": 18,
        tslib: 32,
      },
    ],
    20: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var isNode = require("detect-node");
        (exports.hasProp = function (o, key) {
          return !!o && void 0 !== o[key];
        }),
          (exports.toQuery = function (values, dontSort) {
            void 0 === dontSort && (dontSort = !1);
            var keys = Object.keys(values).filter(function (key) {
              return (
                key &&
                null !== values[key] &&
                "" !== values[key] &&
                (!Array.isArray(values[key]) || 0 < values[key].length)
              );
            });
            return (
              dontSort || keys.sort(),
              0 <
              (dontSort = keys.map(function (key) {
                return (
                  encodeURIComponent(key) +
                  "=" +
                  encodeURIComponent(values[key])
                );
              })).length
                ? "?" + dontSort.join("&")
                : ""
            );
          }),
          (exports.isString = function (obj) {
            return "string" == typeof obj || obj instanceof String;
          }),
          (exports.isBrowser = function () {
            return "undefined" != typeof window;
          }),
          (exports.isIE = function () {
            var msie =
              window && window.document && window.document.documentMode
                ? window.document.documentMode
                : null;
            return !!msie && msie <= 11;
          }),
          (exports.isNodejs = function () {
            return isNode;
          }),
          (exports.defaultMapperForLanguage = function (
            value,
            options,
            params
          ) {
            return !value && params ? params.language : value;
          }),
          (exports.defaultMapperForPublishedVersionStatus = function (
            value,
            options,
            params
          ) {
            return "published" === value ? null : value;
          }),
          (exports.defaultMapperForLatestVersionStatus = function (
            value,
            options,
            params
          ) {
            return "latest" === value ? null : value;
          });
      },
      { "detect-node": 31 },
    ],
    21: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        exports.ClientConfig = class {
          constructor(currentConfig, previousConfig) {
            for (
              this.currentConfig = currentConfig,
                this.previousConfig = previousConfig,
                this.rootUrl = null,
                this.accessToken = null,
                this.defaultHeaders = null,
                this.projectId = null,
                this.language = null,
                this.versionStatus = "published",
                this.pageSize = 25,
                this.responseHandler = null,
                this.fetchFn = null,
                this.rootUrl = this.getValue((c) => c.rootUrl),
                this.accessToken = this.getValue((c) => c.accessToken),
                this.defaultHeaders = this.getValue((c) => c.defaultHeaders),
                this.projectId = this.getValue((c) => c.projectId),
                this.language = this.getValue((c) => c.language),
                this.versionStatus = this.getValue((c) => c.versionStatus),
                this.pageSize = this.getValue((c) => c.pageSize),
                this.responseHandler = this.getValue((c) => c.responseHandler),
                this.fetchFn = this.getValue((c) => c.fetchFn);
              this.rootUrl &&
              "/" === this.rootUrl.substr(this.rootUrl.length - 1, 1);

            )
              this.rootUrl = this.rootUrl.substr(0, this.rootUrl.length - 1);
          }
          toParams() {
            return {
              rootUrl: this.rootUrl,
              accessToken: this.accessToken,
              defaultHeaders: this.defaultHeaders,
              language: this.language,
              versionStatus: this.versionStatus,
              projectId: this.projectId,
              pageIndex: 0,
              pageSize: this.pageSize,
              responseHandler: this.responseHandler,
            };
          }
          getValue(getter) {
            let result = null;
            return (
              this.currentConfig && (result = getter(this.currentConfig)),
              (result =
                this.previousConfig && !result
                  ? getter(this.previousConfig)
                  : result) || getter(this)
            );
          }
        };
      },
      {},
    ],
    22: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        const entry_operations_1 = require("../entries/entry-operations"),
          content_type_operations_1 = require("../content-types/content-type-operations"),
          project_operations_1 = require("../projects/project-operations"),
          taxonomy_operations_1 = require("../taxonomy/taxonomy-operations"),
          client_config_1 = require("./client-config"),
          node_operations_1 = require("../nodes/node-operations"),
          contensis_core_api_1 = require("contensis-core-api"),
          cross_fetch_1 = require("cross-fetch");
        class Client {
          constructor(config = null) {
            (this.clientConfig = null),
              (this.clientConfig = new client_config_1.ClientConfig(
                config,
                Client.defaultClientConfig
              )),
              (this.fetchFn =
                this.clientConfig.fetchFn || cross_fetch_1.default),
              (this.httpClient = new contensis_core_api_1.HttpClient(
                this,
                this.fetchFn
              )),
              (this.entries = new entry_operations_1.EntryOperations(
                this.httpClient,
                this
              )),
              (this.project = new project_operations_1.ProjectOperations(
                this.httpClient,
                this
              )),
              (this.contentTypes =
                new content_type_operations_1.ContentTypeOperations(
                  this.httpClient,
                  this
                )),
              (this.nodes = new node_operations_1.NodeOperations(
                this.httpClient,
                this
              )),
              (this.taxonomy = new taxonomy_operations_1.TaxonomyOperations(
                this.httpClient,
                this
              ));
          }
          static create(config = null) {
            return new Client(config);
          }
          static configure(config) {
            Client.defaultClientConfig = new client_config_1.ClientConfig(
              config,
              Client.defaultClientConfig
            );
          }
          getParams() {
            return this.clientConfig.toParams();
          }
        }
        (Client.defaultClientConfig = null), (exports.Client = Client);
      },
      {
        "../content-types/content-type-operations": 23,
        "../entries/entry-operations": 24,
        "../nodes/node-operations": 27,
        "../projects/project-operations": 28,
        "../taxonomy/taxonomy-operations": 29,
        "./client-config": 21,
        "contensis-core-api": 5,
        "cross-fetch": 30,
      },
    ],
    23: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        const contensis_core_api_1 = require("contensis-core-api");
        exports.ContentTypeOperations = class {
          constructor(httpClient, paramsProvider) {
            (this.httpClient = httpClient),
              (this.paramsProvider = paramsProvider);
          }
          get(contentTypeId) {
            contentTypeId = contensis_core_api_1.UrlBuilder.create(
              "/api/delivery/projects/:projectId/contentTypes/:contentTypeId"
            )
              .addOptions(contentTypeId, "contentTypeId")
              .setParams(this.paramsProvider.getParams())
              .toUrl();
            return this.httpClient.request(contentTypeId);
          }
        };
      },
      { "contensis-core-api": 5 },
    ],
    24: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        const tslib_1 = require("tslib"),
          link_resolver_1 = require("./link-resolver"),
          contensis_core_api_1 = require("contensis-core-api");
        let listUrl = (options, params) =>
            options.contentTypeId
              ? "/api/delivery/projects/:projectId/contentTypes/:contentTypeId/entries"
              : "/api/delivery/projects/:projectId/entries",
          getMappers = {
            language: contensis_core_api_1.defaultMapperForLanguage,
            versionStatus:
              contensis_core_api_1.defaultMapperForPublishedVersionStatus,
            fields: (value) => (value && 0 < value.length ? value : null),
            linkDepth: (value) => (value && 0 < value ? value : null),
          },
          listMappers = Object.assign({}, getMappers, {
            order: (value) => (value && 0 < value.length ? value : null),
            pageIndex: (value, options, params) =>
              (options &&
                options.pageOptions &&
                options.pageOptions.pageIndex) ||
              params.pageIndex,
            pageSize: (value, options, params) =>
              (options &&
                options.pageOptions &&
                options.pageOptions.pageSize) ||
              params.pageSize,
          }),
          searchMappers = {
            linkDepth: (value) => (value && 0 < value ? value : null),
          };
        exports.EntryOperations = class {
          constructor(httpClient, paramsProvider) {
            (this.httpClient = httpClient),
              (this.paramsProvider = paramsProvider);
          }
          get(idOrOptions) {
            idOrOptions = contensis_core_api_1.UrlBuilder.create(
              "/api/delivery/projects/:projectId/entries/:id",
              {
                language: null,
                versionStatus: null,
                linkDepth: null,
                fields: null,
              }
            )
              .addOptions(idOrOptions, "id")
              .setParams(this.paramsProvider.getParams())
              .addMappers(getMappers)
              .toUrl();
            return this.httpClient.request(idOrOptions);
          }
          list(contentTypeIdOrOptions) {
            contentTypeIdOrOptions = contensis_core_api_1.UrlBuilder.create(
              listUrl,
              {
                language: null,
                versionStatus: null,
                linkDepth: null,
                order: null,
                fields: null,
                pageIndex: null,
                pageSize: null,
              }
            )
              .addOptions(contentTypeIdOrOptions, "contentTypeId")
              .setParams(this.paramsProvider.getParams())
              .addMappers(listMappers)
              .toUrl();
            return this.httpClient.request(contentTypeIdOrOptions);
          }
          search(query, linkDepth = 0) {
            if (!query)
              return new Promise((resolve) => {
                resolve(null);
              });
            var deliveryQuery =
              query instanceof contensis_core_api_1.Query ? query : null;
            if (null !== deliveryQuery || query.where || query.orderBy)
              return this.searchUsingQuery(deliveryQuery || query, linkDepth);
            let zenqlQuery =
              query instanceof contensis_core_api_1.ZenqlQuery ? query : null;
            if (null === zenqlQuery) {
              if ("string" != typeof query)
                throw new Error("A valid query needs to be specified.");
              zenqlQuery = new contensis_core_api_1.ZenqlQuery(query);
            }
            var deliveryQuery = this.paramsProvider.getParams(),
              query = deliveryQuery.pageSize || 25,
              pageIndex = deliveryQuery.pageIndex || 0,
              fields = [],
              query = zenqlQuery.pageSize || query,
              pageIndex = zenqlQuery.pageIndex || pageIndex,
              fields = zenqlQuery.fields || fields,
              projectId = deliveryQuery["projectId"],
              deliveryQuery = tslib_1.__rest(deliveryQuery, [
                "accessToken",
                "projectId",
                "language",
                "responseHandler",
                "rootUrl",
                "versionStatus",
              ]),
              deliveryQuery = Object.assign({}, deliveryQuery, {
                linkDepth: linkDepth,
                pageSize: query,
                pageIndex: pageIndex,
                zenql: zenqlQuery.zenql,
              }),
              linkDepth =
                (fields && 0 < fields.length && (deliveryQuery.fields = fields),
                contensis_core_api_1.UrlBuilder.create(
                  "/api/delivery/projects/:projectId/entries",
                  Object.assign({}, deliveryQuery)
                )
                  .setParams(
                    Object.assign({}, deliveryQuery, { projectId: projectId })
                  )
                  .addMappers(searchMappers)
                  .toUrl());
            return this.httpClient.request(linkDepth, {
              method: "GET",
              headers: { "Content-Type": "application/json; charset=utf-8" },
            });
          }
          resolve(entryOrList, fields = null) {
            var params = this.paramsProvider.getParams();
            return new link_resolver_1.LinkResolver(
              entryOrList,
              fields,
              params.versionStatus,
              (query) => this.search(query)
            ).resolve();
          }
          searchUsingQuery(query, linkDepth = 0) {
            var deliveryQuery,
              pageIndex,
              fields,
              orderBy,
              accessToken,
              projectId,
              language,
              responseHandler,
              rootUrl,
              versionStatus,
              params,
              pageSize;
            return query
              ? ((deliveryQuery = query),
                (pageSize =
                  (params = this.paramsProvider.getParams()).pageSize || 25),
                (pageIndex = params.pageIndex || 0),
                (fields = []),
                (pageSize = deliveryQuery.pageSize || pageSize),
                (pageIndex = deliveryQuery.pageIndex || pageIndex),
                (fields = deliveryQuery.fields || fields),
                (orderBy =
                  deliveryQuery.orderBy &&
                  (deliveryQuery.orderBy._items || deliveryQuery.orderBy)),
                ({
                  accessToken,
                  projectId,
                  language,
                  responseHandler,
                  rootUrl,
                  versionStatus,
                } = params),
                (params = tslib_1.__rest(params, [
                  "accessToken",
                  "projectId",
                  "language",
                  "responseHandler",
                  "rootUrl",
                  "versionStatus",
                ])),
                (params = Object.assign({}, params, {
                  linkDepth: linkDepth,
                  pageSize: pageSize,
                  pageIndex: pageIndex,
                  where: JSON.stringify(deliveryQuery.where),
                })),
                fields && 0 < fields.length && (params.fields = fields),
                deliveryQuery.orderBy &&
                  (!Array.isArray(deliveryQuery.orderBy) ||
                    0 < deliveryQuery.orderBy.length) &&
                  (params.orderBy = JSON.stringify(orderBy)),
                (pageSize = contensis_core_api_1.UrlBuilder.create(
                  "/api/delivery/projects/:projectId/entries/search",
                  Object.assign({}, params)
                )
                  .setParams(
                    Object.assign({}, params, { projectId: projectId })
                  )
                  .addMappers(searchMappers)
                  .toUrl()),
                contensis_core_api_1.isBrowser() &&
                contensis_core_api_1.isIE() &&
                2083 < pageSize.length
                  ? this.searchUsingPost(query, linkDepth)
                  : this.httpClient.request(pageSize, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json; charset=utf-8",
                      },
                    }))
              : new Promise((resolve) => {
                  resolve(null);
                });
          }
          searchUsingPost(query, linkDepth = 0) {
            var params;
            return query
              ? ((params = this.paramsProvider.getParams()),
                (query.pageSize = query.pageSize || params.pageSize),
                (query.pageIndex = query.pageIndex || 0),
                (params = contensis_core_api_1.UrlBuilder.create(
                  "/api/delivery/projects/:projectId/entries/search",
                  { linkDepth: linkDepth }
                )
                  .setParams(this.paramsProvider.getParams())
                  .addMappers(searchMappers)
                  .toUrl()),
                this.httpClient.request(params, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify(query),
                }))
              : new Promise((resolve) => {
                  resolve(null);
                });
          }
        };
      },
      { "./link-resolver": 25, "contensis-core-api": 5, tslib: 32 },
    ],
    25: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        const contensis_core_api_1 = require("contensis-core-api");
        function isUnresolvedEntry(value) {
          return (
            !!(value && value.sys && value.sys.id) &&
            1 === Object.keys(value).length
          );
        }
        function isUnresolvedImage(value) {
          return (
            value &&
            value.asset &&
            Object.keys(value).length <= 2 &&
            isUnresolvedEntry(value.asset)
          );
        }
        function isComposerItem(value) {
          return (
            !!(value && value.type && value.value) &&
            2 === Object.keys(value).length
          );
        }
        class DeferredEntry {
          constructor(sys, versionStatus) {
            (this.sys = sys),
              (this.versionStatus = versionStatus),
              (this.promise = new Promise((resolve, reject) => {
                (this.resolve = resolve), (this.reject = reject);
              })),
              (this.expression = contensis_core_api_1.Op.and(
                contensis_core_api_1.Op.equalTo("sys.id", sys.id),
                contensis_core_api_1.Op.equalTo("sys.language", sys.language),
                contensis_core_api_1.Op.equalTo(
                  "sys.versionStatus",
                  this.versionStatus
                )
              ));
          }
          is(sys) {
            return !!(
              sys &&
              sys.id &&
              sys.language &&
              sys.id === this.sys.id &&
              sys.language === this.sys.language
            );
          }
        }
        class ListResolver {
          constructor(entries, paths, versionStatus, search) {
            (this.entries = entries),
              (this.paths = paths),
              (this.versionStatus = versionStatus),
              (this.search = search),
              (this.deferredEntries = []);
          }
          resolve() {
            this.deferredEntries = [];
            var promises = this.entries.map((entry) => {
              return new EntryResolver(entry, this.paths, (id, language) =>
                this.getEntry(id, language)
              ).resolve();
            });
            return (
              this.nestedSearch(),
              Promise.all(promises).then((values) => this.entries)
            );
          }
          getEntry(id, language) {
            id = new DeferredEntry(
              { id: id, language: language },
              this.versionStatus
            );
            return this.deferredEntries.push(id), id.promise;
          }
          nestedSearch() {
            var expressions = this.deferredEntries.map((g) => g.expression),
              query = new contensis_core_api_1.Query(
                contensis_core_api_1.Op.or(...expressions)
              );
            return (
              (query.pageIndex = 0),
              (query.pageSize = expressions.length),
              this.search(query)
                .then((list) => {
                  var allDeferredEntries = this.deferredEntries,
                    promises = ((this.deferredEntries = []), []);
                  for (let item of list.items) {
                    var deferredEntry,
                      deferredEntries = allDeferredEntries.filter(
                        (deferredEntry) => deferredEntry.is(item.sys)
                      );
                    for (deferredEntry of deferredEntries)
                      deferredEntry.resolve(item),
                        promises.push(deferredEntry.promise);
                  }
                  return Promise.all(promises).then(() =>
                    Promise.resolve(list)
                  );
                })
                .then((value) =>
                  0 < this.deferredEntries.length ? this.nestedSearch() : value
                )
            );
          }
        }
        class EntryResolver {
          constructor(entry, paths, getEntry) {
            (this.entry = entry),
              (this.paths = paths),
              (this.getEntry = getEntry);
          }
          resolve() {
            var promises = (this.paths || Object.keys(this.entry)).map(
              (path) => {
                let parts = path.split("."),
                  field = parts.shift(),
                  promise = null;
                var composerType,
                  path = this.entry[field];
                return (
                  path &&
                    !(promise = this.resolveField(path)) &&
                    (function (value) {
                      return (
                        Array.isArray(value) &&
                        0 < value.length &&
                        isComposerItem(value[0])
                      );
                    })(path) &&
                    ((composerType = 0 < parts.length ? parts.shift() : null),
                    (promise = this.resolveComposerField(path, composerType))),
                  (promise = promise
                    ? promise.then(
                        (resolvedValue) => (
                          (this.entry[field] = resolvedValue.value),
                          resolvedValue
                        )
                      )
                    : Promise.resolve(null)).then((v) =>
                    this.next(v, parts.join("."))
                  )
                );
              }
            );
            return Promise.all(promises).then((values) => this.entry);
          }
          next(resolvedEntry, path) {
            return !path ||
              !resolvedEntry ||
              !resolvedEntry.entries ||
              resolvedEntry.entries.length <= 0
              ? Promise.resolve(resolvedEntry)
              : ((resolvedEntry = resolvedEntry.entries.map((entry) => {
                  return new EntryResolver(entry, [path], (id, language) =>
                    this.getEntry(id, language)
                  ).resolve();
                })),
                Promise.all(resolvedEntry));
          }
          resolveField(value) {
            if (isUnresolvedEntry(value)) return this.resolveEntry(value);
            if (isUnresolvedImage(value)) return this.resolveImage(value);
            if (Array.isArray(value)) {
              let isResolving = !1;
              value = value.map((item) =>
                isUnresolvedEntry(item)
                  ? ((isResolving = !0), this.resolveEntry(item))
                  : isUnresolvedImage(item)
                  ? ((isResolving = !0), this.resolveImage(item))
                  : Promise.resolve({ entries: [], value: item })
              );
              if (isResolving)
                return Promise.all(value).then((resolvedEntries) => {
                  var e,
                    list = [];
                  let entries = [];
                  for (e of resolvedEntries)
                    list.push(e.value), (entries = entries.concat(e.entries));
                  return { entries: entries, value: list };
                });
            }
            return null;
          }
          resolveComposerField(value, type) {
            if (Array.isArray(value)) {
              let isResolving = !1;
              value = value.map((item) => {
                if (isComposerItem(item) && (!type || type === item.type)) {
                  var itemPromise = this.resolveField(item.value);
                  if (itemPromise)
                    return (
                      (isResolving = !0),
                      itemPromise.then((v) => ((item.value = v), item))
                    );
                }
                return Promise.resolve({ entries: [], value: item });
              });
              if (isResolving)
                return Promise.all(value).then((resolvedEntries) => {
                  var e,
                    list = [];
                  let entries = [];
                  for (e of resolvedEntries)
                    list.push(e.value), (entries = entries.concat(e.entries));
                  return { entries: entries, value: list };
                });
            }
            return null;
          }
          resolveEntry(value) {
            var language;
            return value && value.sys && value.sys.id
              ? ((language = value.sys.language || this.entry.sys.language),
                this.getEntry(value.sys.id, language).then((entry) => ({
                  entries: [entry],
                  value: entry,
                })))
              : Promise.resolve({ entries: [], value: value });
          }
          resolveImage(value) {
            var language;
            return value && value.asset && value.asset.sys && value.asset.sys.id
              ? ((language =
                  value.asset.sys.language || this.entry.sys.language),
                this.getEntry(value.asset.sys.id, language).then((image) => ({
                  entries: [(value.asset = image)],
                  value: value,
                })))
              : Promise.resolve({ entries: [], value: value });
          }
        }
        exports.LinkResolver = class {
          constructor(entryOrList, paths, versionStatus, search) {
            (this.entryOrList = entryOrList),
              (this.paths = paths),
              (this.versionStatus = versionStatus),
              (this.search = search);
          }
          resolve() {
            var entries = this.getEntries();
            let promise = Promise.resolve([]);
            return (
              0 < entries.length &&
                ((entries = new ListResolver(
                  entries,
                  this.paths,
                  this.versionStatus,
                  this.search
                )),
                (promise = entries.resolve())),
              promise.then(() => this.entryOrList)
            );
          }
          getEntries() {
            var entryOrList = this.entryOrList;
            return entryOrList
              ? Array.isArray(entryOrList)
                ? entryOrList
                : entryOrList.items && Array.isArray(entryOrList.items)
                ? entryOrList.items
                : [entryOrList]
              : [];
          }
        };
      },
      { "contensis-core-api": 5 },
    ],
    26: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        var contensis_core_api_1 = require("contensis-core-api"),
          contensis_core_api_1 =
            ((exports.Op = contensis_core_api_1.Op),
            (exports.OrderBy = contensis_core_api_1.OrderBy),
            (exports.Query = contensis_core_api_1.Query),
            (exports.ZenqlQuery = contensis_core_api_1.ZenqlQuery),
            require("./client/client"));
        exports.Client = contensis_core_api_1.Client;
      },
      { "./client/client": 22, "contensis-core-api": 5 },
    ],
    27: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        const contensis_core_api_1 = require("contensis-core-api");
        let nodeDefaultOptionsMappers = {
            language: contensis_core_api_1.defaultMapperForLanguage,
            versionStatus:
              contensis_core_api_1.defaultMapperForPublishedVersionStatus,
            entryFields: (value) => (value && 0 < value.length ? value : null),
            entryLinkDepth: (value) => (value && 0 < value ? value : null),
          },
          nodeDefaultWithDepthOptionsMappers = Object.assign(
            {},
            nodeDefaultOptionsMappers,
            { depth: (value) => (value && 0 < value ? value : null) }
          ),
          nodeGetByPathOptions = Object.assign(
            {},
            nodeDefaultWithDepthOptionsMappers,
            { allowPartialMatch: (value) => !!value || null }
          ),
          nodeGetByEntryOptions = Object.assign({}, nodeDefaultOptionsMappers, {
            entryId: (value) => value || null,
          }),
          nodeGetAncestorAtLevelOptionsMappers = Object.assign(
            {},
            nodeDefaultWithDepthOptionsMappers,
            { startLevel: (value) => (value && 0 < value ? value : null) }
          ),
          nodeGetAncestorsOptionsMappers = Object.assign(
            {},
            nodeDefaultOptionsMappers,
            { startLevel: (value) => (value && 0 < value ? value : null) }
          );
        exports.NodeOperations = class {
          constructor(httpClient, paramsProvider) {
            if (
              ((this.httpClient = httpClient),
              (this.paramsProvider = paramsProvider),
              !this.httpClient || !this.paramsProvider)
            )
              throw new Error("The class was not initialised correctly.");
          }
          getRoot(options) {
            options = contensis_core_api_1.UrlBuilder.create(
              "/api/delivery/projects/:projectId/nodes/root",
              {
                language: null,
                depth: null,
                versionStatus: null,
                entryFields: null,
                entryLinkDepth: null,
              }
            )
              .addOptions(options)
              .setParams(this.paramsProvider.getParams())
              .addMappers(nodeDefaultWithDepthOptionsMappers)
              .toUrl();
            return this.httpClient.request(options);
          }
          get(idOrPathOrOptions) {
            if (
              (contensis_core_api_1.isString(idOrPathOrOptions) &&
                !idOrPathOrOptions) ||
              ("object" == typeof idOrPathOrOptions &&
                (null === idOrPathOrOptions ||
                  (!idOrPathOrOptions.id && !idOrPathOrOptions.path)))
            )
              throw new Error("A valid node id or path needs to be specified.");
            var isPath =
                (contensis_core_api_1.isString(idOrPathOrOptions) &&
                  idOrPathOrOptions.startsWith("/")) ||
                (!!idOrPathOrOptions && !!idOrPathOrOptions.path),
              urlTemplate = isPath
                ? "/api/delivery/projects/:projectId/nodes:path"
                : "/api/delivery/projects/:projectId/nodes/:id",
              urlTemplate = contensis_core_api_1.UrlBuilder.create(
                urlTemplate,
                {
                  language: null,
                  depth: null,
                  versionStatus: null,
                  entryFields: null,
                  entryLinkDepth: null,
                  allowPartialMatch: null,
                }
              )
                .addOptions(idOrPathOrOptions, isPath ? "path" : "id")
                .setParams(this.paramsProvider.getParams())
                .addMappers(nodeGetByPathOptions)
                .toUrl();
            return this.httpClient.request(urlTemplate);
          }
          getByEntry(entryIdOrEntryOrOptions) {
            var validationMessage = "A valid entry id needs to be specified.";
            if (
              contensis_core_api_1.isString(entryIdOrEntryOrOptions) &&
              !entryIdOrEntryOrOptions
            )
              throw new Error(validationMessage);
            if ("object" == typeof entryIdOrEntryOrOptions) {
              if (null === entryIdOrEntryOrOptions)
                throw new Error(validationMessage);
              if (
                !(
                  entryIdOrEntryOrOptions.entryId ||
                  (entryIdOrEntryOrOptions.entry &&
                    entryIdOrEntryOrOptions.entry.sys &&
                    entryIdOrEntryOrOptions.entry.sys.id) ||
                  (entryIdOrEntryOrOptions.sys &&
                    entryIdOrEntryOrOptions.sys.id)
                )
              )
                throw new Error(validationMessage);
            }
            let entryId = null;
            contensis_core_api_1.isString(entryIdOrEntryOrOptions)
              ? (entryId = entryIdOrEntryOrOptions)
              : "object" == typeof entryIdOrEntryOrOptions &&
                (entryIdOrEntryOrOptions.sys &&
                  (entryId = entryIdOrEntryOrOptions.sys.id),
                entryIdOrEntryOrOptions.entry &&
                  entryIdOrEntryOrOptions.entry.sys &&
                  (entryId = entryIdOrEntryOrOptions.entry.sys.id));
            validationMessage = contensis_core_api_1.UrlBuilder.create(
              "/api/delivery/projects/:projectId/nodes/",
              {
                entryId: null,
                language: null,
                versionStatus: null,
                entryFields: null,
                entryLinkDepth: null,
              }
            )
              .addOptions(entryId, "entryId")
              .addOptions(entryIdOrEntryOrOptions)
              .setParams(this.paramsProvider.getParams())
              .addMappers(nodeGetByEntryOptions)
              .toUrl();
            return this.httpClient.request(validationMessage);
          }
          getChildren(idOrNodeOrOptions) {
            this.validateNodeId(idOrNodeOrOptions);
            var nodeId = this.getNodeIdFromOptions(idOrNodeOrOptions),
              nodeId = contensis_core_api_1.UrlBuilder.create(
                "/api/delivery/projects/:projectId/nodes/:id/children",
                {
                  language: null,
                  versionStatus: null,
                  entryFields: null,
                  entryLinkDepth: null,
                }
              )
                .addOptions(nodeId, "id")
                .addOptions(idOrNodeOrOptions)
                .setParams(this.paramsProvider.getParams())
                .addMappers(nodeDefaultOptionsMappers)
                .toUrl();
            return this.httpClient.request(nodeId);
          }
          getParent(idOrNodeOrOptions) {
            this.validateNodeId(idOrNodeOrOptions);
            var nodeId = this.getNodeIdFromOptions(idOrNodeOrOptions),
              nodeId = contensis_core_api_1.UrlBuilder.create(
                "/api/delivery/projects/:projectId/nodes/:id/parent",
                {
                  language: null,
                  depth: null,
                  versionStatus: null,
                  entryFields: null,
                  entryLinkDepth: null,
                }
              )
                .addOptions(nodeId, "id")
                .addOptions(idOrNodeOrOptions)
                .setParams(this.paramsProvider.getParams())
                .addMappers(nodeDefaultWithDepthOptionsMappers)
                .toUrl();
            return this.httpClient.request(nodeId);
          }
          getAncestorAtLevel(options) {
            this.validateNodeId(options);
            var nodeId = this.getNodeIdFromOptions(options),
              nodeId = contensis_core_api_1.UrlBuilder.create(
                "/api/delivery/projects/:projectId/nodes/:id/ancestor",
                {
                  language: null,
                  startLevel: null,
                  depth: null,
                  versionStatus: null,
                  entryFields: null,
                  entryLinkDepth: null,
                }
              )
                .addOptions(nodeId, "id")
                .addOptions(options)
                .setParams(this.paramsProvider.getParams())
                .addMappers(nodeGetAncestorAtLevelOptionsMappers)
                .toUrl();
            return this.httpClient.request(nodeId);
          }
          getAncestors(idOrNodeOrOptions) {
            this.validateNodeId(idOrNodeOrOptions);
            var nodeId = this.getNodeIdFromOptions(idOrNodeOrOptions),
              nodeId = contensis_core_api_1.UrlBuilder.create(
                "/api/delivery/projects/:projectId/nodes/:id/ancestors",
                {
                  language: null,
                  startLevel: null,
                  versionStatus: null,
                  entryFields: null,
                  entryLinkDepth: null,
                }
              )
                .addOptions(nodeId, "id")
                .addOptions(idOrNodeOrOptions)
                .setParams(this.paramsProvider.getParams())
                .addMappers(nodeGetAncestorsOptionsMappers)
                .toUrl();
            return this.httpClient.request(nodeId);
          }
          getSiblings(idOrNodeOrOptions) {
            this.validateNodeId(idOrNodeOrOptions);
            var nodeId = this.getNodeIdFromOptions(idOrNodeOrOptions),
              nodeId = contensis_core_api_1.UrlBuilder.create(
                "/api/delivery/projects/:projectId/nodes/:id/siblings",
                {
                  language: null,
                  versionStatus: null,
                  entryFields: null,
                  entryLinkDepth: null,
                }
              )
                .addOptions(nodeId, "id")
                .addOptions(idOrNodeOrOptions)
                .setParams(this.paramsProvider.getParams())
                .addMappers(nodeDefaultOptionsMappers)
                .toUrl();
            return this.httpClient.request(nodeId);
          }
          validateNodeId(idOrNodeOrOptions) {
            var validationMessage = "A valid node id needs to be specified.";
            if (
              contensis_core_api_1.isString(idOrNodeOrOptions) &&
              !idOrNodeOrOptions
            )
              throw new Error(validationMessage);
            if ("object" == typeof idOrNodeOrOptions) {
              if (null === idOrNodeOrOptions)
                throw new Error(validationMessage);
              if (
                !(
                  idOrNodeOrOptions.id ||
                  (idOrNodeOrOptions.node && idOrNodeOrOptions.node.id)
                )
              )
                throw new Error(validationMessage);
            }
          }
          getNodeIdFromOptions(idOrNodeOrOptions) {
            let nodeId = null;
            return (
              contensis_core_api_1.isString(idOrNodeOrOptions)
                ? (nodeId = idOrNodeOrOptions)
                : "object" == typeof idOrNodeOrOptions &&
                  (idOrNodeOrOptions.id
                    ? (nodeId = idOrNodeOrOptions.id)
                    : idOrNodeOrOptions.node &&
                      (nodeId = idOrNodeOrOptions.node.id)),
              nodeId
            );
          }
        };
      },
      { "contensis-core-api": 5 },
    ],
    28: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        const contensis_core_api_1 = require("contensis-core-api");
        exports.ProjectOperations = class {
          constructor(httpClient, paramsProvider) {
            (this.httpClient = httpClient),
              (this.paramsProvider = paramsProvider);
          }
          get() {
            var url = contensis_core_api_1.UrlBuilder.create(
              "/api/delivery/projects/:projectId"
            )
              .setParams(this.paramsProvider.getParams())
              .toUrl();
            return this.httpClient.request(url);
          }
        };
      },
      { "contensis-core-api": 5 },
    ],
    29: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        const contensis_core_api_1 = require("contensis-core-api");
        let taxonomyMappers = {
          order: (value) => ("defined" === value ? value : null),
        };
        exports.TaxonomyOperations = class {
          constructor(httpClient, paramsProvider) {
            (this.httpClient = httpClient),
              (this.paramsProvider = paramsProvider);
          }
          getNodeByKey(key) {
            key = contensis_core_api_1.UrlBuilder.create(
              "/api/delivery/projects/:projectId/taxonomy/nodes/:key",
              { order: null, childDepth: null, language: null }
            )
              .addOptions(key, "key")
              .setParams(this.paramsProvider.getParams())
              .addMappers(taxonomyMappers)
              .toUrl();
            return this.httpClient.request(key);
          }
          getNodeByPath(path) {
            path = contensis_core_api_1.UrlBuilder.create(
              "/api/delivery/projects/:projectId/taxonomy/nodes",
              { order: null, childDepth: null, language: null, path: null }
            )
              .addOptions(path, "path")
              .setParams(this.paramsProvider.getParams())
              .addMappers(taxonomyMappers)
              .toUrl();
            return this.httpClient.request(path);
          }
          resolveChildren(node) {
            let taxonomyNodeOrKey = null,
              getNodeByKeyOptions = { childDepth: 1 };
            return (
              node.node
                ? ((taxonomyNodeOrKey = node.node),
                  (getNodeByKeyOptions = {
                    childDepth: node.childDepth || 1,
                    order: node.order,
                    language: node.language,
                  }))
                : !node.key || node.path
                ? (taxonomyNodeOrKey = node)
                : ((taxonomyNodeOrKey = node.key),
                  (getNodeByKeyOptions = {
                    childDepth: node.childDepth || 1,
                    order: node.order,
                    language: node.language,
                  })),
              "string" == typeof taxonomyNodeOrKey
                ? this.getNodeByKey(
                    Object.assign({}, getNodeByKeyOptions, {
                      key: taxonomyNodeOrKey,
                    })
                  )
                : taxonomyNodeOrKey.hasChildren
                ? taxonomyNodeOrKey.children &&
                  0 < taxonomyNodeOrKey.children.length
                  ? Promise.resolve(Object.assign({}, taxonomyNodeOrKey))
                  : this.getNodeByKey(
                      Object.assign({}, getNodeByKeyOptions, {
                        key: taxonomyNodeOrKey.key,
                      })
                    )
                : Promise.resolve(
                    Object.assign({}, taxonomyNodeOrKey, { children: [] })
                  )
            );
          }
        };
      },
      { "contensis-core-api": 5 },
    ],
    30: [
      function (require, module, exports) {
        var global = "undefined" != typeof self ? self : this,
          __self__ = ((F.prototype = global), new F());
        function F() {
          (this.fetch = !1), (this.DOMException = global.DOMException);
        }
        !(function (self) {
          !(function (exports) {
            var viewClasses,
              isArrayBufferView,
              support_searchParams = "URLSearchParams" in self,
              support_iterable = "Symbol" in self && "iterator" in Symbol,
              support_blob =
                "FileReader" in self &&
                "Blob" in self &&
                (function () {
                  try {
                    return new Blob(), !0;
                  } catch (e) {
                    return !1;
                  }
                })(),
              support_formData = "FormData" in self,
              support_arrayBuffer = "ArrayBuffer" in self;
            function normalizeName(name) {
              if (
                ("string" != typeof name && (name = String(name)),
                /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name))
              )
                throw new TypeError("Invalid character in header field name");
              return name.toLowerCase();
            }
            function normalizeValue(value) {
              return (value = "string" != typeof value ? String(value) : value);
            }
            function iteratorFor(items) {
              var iterator = {
                next: function () {
                  var value = items.shift();
                  return { done: void 0 === value, value: value };
                },
              };
              return (
                support_iterable &&
                  (iterator[Symbol.iterator] = function () {
                    return iterator;
                  }),
                iterator
              );
            }
            function Headers(headers) {
              (this.map = {}),
                headers instanceof Headers
                  ? headers.forEach(function (value, name) {
                      this.append(name, value);
                    }, this)
                  : Array.isArray(headers)
                  ? headers.forEach(function (header) {
                      this.append(header[0], header[1]);
                    }, this)
                  : headers &&
                    Object.getOwnPropertyNames(headers).forEach(function (
                      name
                    ) {
                      this.append(name, headers[name]);
                    },
                    this);
            }
            function consumed(body) {
              if (body.bodyUsed)
                return Promise.reject(new TypeError("Already read"));
              body.bodyUsed = !0;
            }
            function fileReaderReady(reader) {
              return new Promise(function (resolve, reject) {
                (reader.onload = function () {
                  resolve(reader.result);
                }),
                  (reader.onerror = function () {
                    reject(reader.error);
                  });
              });
            }
            function readBlobAsArrayBuffer(blob) {
              var reader = new FileReader(),
                promise = fileReaderReady(reader);
              return reader.readAsArrayBuffer(blob), promise;
            }
            function bufferClone(buf) {
              var view;
              return buf.slice
                ? buf.slice(0)
                : ((view = new Uint8Array(buf.byteLength)).set(
                    new Uint8Array(buf)
                  ),
                  view.buffer);
            }
            function Body() {
              return (
                (this.bodyUsed = !1),
                (this._initBody = function (body) {
                  var obj;
                  (this._bodyInit = body)
                    ? "string" == typeof body
                      ? (this._bodyText = body)
                      : support_blob && Blob.prototype.isPrototypeOf(body)
                      ? (this._bodyBlob = body)
                      : support_formData &&
                        FormData.prototype.isPrototypeOf(body)
                      ? (this._bodyFormData = body)
                      : support_searchParams &&
                        URLSearchParams.prototype.isPrototypeOf(body)
                      ? (this._bodyText = body.toString())
                      : support_arrayBuffer &&
                        support_blob &&
                        (obj = body) &&
                        DataView.prototype.isPrototypeOf(obj)
                      ? ((this._bodyArrayBuffer = bufferClone(body.buffer)),
                        (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                      : support_arrayBuffer &&
                        (ArrayBuffer.prototype.isPrototypeOf(body) ||
                          isArrayBufferView(body))
                      ? (this._bodyArrayBuffer = bufferClone(body))
                      : (this._bodyText = body =
                          Object.prototype.toString.call(body))
                    : (this._bodyText = ""),
                    this.headers.get("content-type") ||
                      ("string" == typeof body
                        ? this.headers.set(
                            "content-type",
                            "text/plain;charset=UTF-8"
                          )
                        : this._bodyBlob && this._bodyBlob.type
                        ? this.headers.set("content-type", this._bodyBlob.type)
                        : support_searchParams &&
                          URLSearchParams.prototype.isPrototypeOf(body) &&
                          this.headers.set(
                            "content-type",
                            "application/x-www-form-urlencoded;charset=UTF-8"
                          ));
                }),
                support_blob &&
                  ((this.blob = function () {
                    var rejected = consumed(this);
                    if (rejected) return rejected;
                    if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                    if (this._bodyArrayBuffer)
                      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                    if (this._bodyFormData)
                      throw new Error("could not read FormData body as blob");
                    return Promise.resolve(new Blob([this._bodyText]));
                  }),
                  (this.arrayBuffer = function () {
                    return this._bodyArrayBuffer
                      ? consumed(this) || Promise.resolve(this._bodyArrayBuffer)
                      : this.blob().then(readBlobAsArrayBuffer);
                  })),
                (this.text = function () {
                  var reader,
                    promise,
                    rejected = consumed(this);
                  if (rejected) return rejected;
                  if (this._bodyBlob)
                    return (
                      (rejected = this._bodyBlob),
                      (reader = new FileReader()),
                      (promise = fileReaderReady(reader)),
                      reader.readAsText(rejected),
                      promise
                    );
                  if (this._bodyArrayBuffer)
                    return Promise.resolve(
                      (function (buf) {
                        for (
                          var view = new Uint8Array(buf),
                            chars = new Array(view.length),
                            i = 0;
                          i < view.length;
                          i++
                        )
                          chars[i] = String.fromCharCode(view[i]);
                        return chars.join("");
                      })(this._bodyArrayBuffer)
                    );
                  if (this._bodyFormData)
                    throw new Error("could not read FormData body as text");
                  return Promise.resolve(this._bodyText);
                }),
                support_formData &&
                  (this.formData = function () {
                    return this.text().then(decode);
                  }),
                (this.json = function () {
                  return this.text().then(JSON.parse);
                }),
                this
              );
            }
            support_arrayBuffer &&
              ((viewClasses = [
                "[object Int8Array]",
                "[object Uint8Array]",
                "[object Uint8ClampedArray]",
                "[object Int16Array]",
                "[object Uint16Array]",
                "[object Int32Array]",
                "[object Uint32Array]",
                "[object Float32Array]",
                "[object Float64Array]",
              ]),
              (isArrayBufferView =
                ArrayBuffer.isView ||
                function (obj) {
                  return (
                    obj &&
                    -1 <
                      viewClasses.indexOf(Object.prototype.toString.call(obj))
                  );
                })),
              (Headers.prototype.append = function (name, value) {
                (name = normalizeName(name)), (value = normalizeValue(value));
                var oldValue = this.map[name];
                this.map[name] = oldValue ? oldValue + ", " + value : value;
              }),
              (Headers.prototype.delete = function (name) {
                delete this.map[normalizeName(name)];
              }),
              (Headers.prototype.get = function (name) {
                return (
                  (name = normalizeName(name)),
                  this.has(name) ? this.map[name] : null
                );
              }),
              (Headers.prototype.has = function (name) {
                return this.map.hasOwnProperty(normalizeName(name));
              }),
              (Headers.prototype.set = function (name, value) {
                this.map[normalizeName(name)] = normalizeValue(value);
              }),
              (Headers.prototype.forEach = function (callback, thisArg) {
                for (var name in this.map)
                  this.map.hasOwnProperty(name) &&
                    callback.call(thisArg, this.map[name], name, this);
              }),
              (Headers.prototype.keys = function () {
                var items = [];
                return (
                  this.forEach(function (value, name) {
                    items.push(name);
                  }),
                  iteratorFor(items)
                );
              }),
              (Headers.prototype.values = function () {
                var items = [];
                return (
                  this.forEach(function (value) {
                    items.push(value);
                  }),
                  iteratorFor(items)
                );
              }),
              (Headers.prototype.entries = function () {
                var items = [];
                return (
                  this.forEach(function (value, name) {
                    items.push([name, value]);
                  }),
                  iteratorFor(items)
                );
              }),
              support_iterable &&
                (Headers.prototype[Symbol.iterator] =
                  Headers.prototype.entries);
            var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
            function Request(input, options) {
              var upcased,
                body = (options = options || {}).body;
              if (input instanceof Request) {
                if (input.bodyUsed) throw new TypeError("Already read");
                (this.url = input.url),
                  (this.credentials = input.credentials),
                  options.headers ||
                    (this.headers = new Headers(input.headers)),
                  (this.method = input.method),
                  (this.mode = input.mode),
                  (this.signal = input.signal),
                  body ||
                    null == input._bodyInit ||
                    ((body = input._bodyInit), (input.bodyUsed = !0));
              } else this.url = String(input);
              if (
                ((this.credentials =
                  options.credentials || this.credentials || "same-origin"),
                (!options.headers && this.headers) ||
                  (this.headers = new Headers(options.headers)),
                (this.method =
                  ((input = options.method || this.method || "GET"),
                  (upcased = input.toUpperCase()),
                  -1 < methods.indexOf(upcased) ? upcased : input)),
                (this.mode = options.mode || this.mode || null),
                (this.signal = options.signal || this.signal),
                (this.referrer = null),
                ("GET" === this.method || "HEAD" === this.method) && body)
              )
                throw new TypeError(
                  "Body not allowed for GET or HEAD requests"
                );
              this._initBody(body);
            }
            function decode(body) {
              var form = new FormData();
              return (
                body
                  .trim()
                  .split("&")
                  .forEach(function (bytes) {
                    var name;
                    bytes &&
                      ((name = (bytes = bytes.split("="))
                        .shift()
                        .replace(/\+/g, " ")),
                      (bytes = bytes.join("=").replace(/\+/g, " ")),
                      form.append(
                        decodeURIComponent(name),
                        decodeURIComponent(bytes)
                      ));
                  }),
                form
              );
            }
            function Response(bodyInit, options) {
              (options = options || {}),
                (this.type = "default"),
                (this.status =
                  void 0 === options.status ? 200 : options.status),
                (this.ok = 200 <= this.status && this.status < 300),
                (this.statusText =
                  "statusText" in options ? options.statusText : "OK"),
                (this.headers = new Headers(options.headers)),
                (this.url = options.url || ""),
                this._initBody(bodyInit);
            }
            (Request.prototype.clone = function () {
              return new Request(this, { body: this._bodyInit });
            }),
              Body.call(Request.prototype),
              Body.call(Response.prototype),
              (Response.prototype.clone = function () {
                return new Response(this._bodyInit, {
                  status: this.status,
                  statusText: this.statusText,
                  headers: new Headers(this.headers),
                  url: this.url,
                });
              }),
              (Response.error = function () {
                var response = new Response(null, {
                  status: 0,
                  statusText: "",
                });
                return (response.type = "error"), response;
              });
            var redirectStatuses = [301, 302, 303, 307, 308];
            (Response.redirect = function (url, status) {
              if (-1 === redirectStatuses.indexOf(status))
                throw new RangeError("Invalid status code");
              return new Response(null, {
                status: status,
                headers: { location: url },
              });
            }),
              (exports.DOMException = self.DOMException);
            try {
              new exports.DOMException();
            } catch (err) {
              (exports.DOMException = function (message, name) {
                (this.message = message), (this.name = name);
                name = Error(message);
                this.stack = name.stack;
              }),
                (exports.DOMException.prototype = Object.create(
                  Error.prototype
                )),
                (exports.DOMException.prototype.constructor =
                  exports.DOMException);
            }
            function fetch(input, init) {
              return new Promise(function (resolve, reject) {
                var request = new Request(input, init);
                if (request.signal && request.signal.aborted)
                  return reject(
                    new exports.DOMException("Aborted", "AbortError")
                  );
                var xhr = new XMLHttpRequest();
                function abortXhr() {
                  xhr.abort();
                }
                (xhr.onload = function () {
                  var headers,
                    rawHeaders = {
                      status: xhr.status,
                      statusText: xhr.statusText,
                      headers:
                        ((rawHeaders = xhr.getAllResponseHeaders() || ""),
                        (headers = new Headers()),
                        rawHeaders
                          .replace(/\r?\n[\t ]+/g, " ")
                          .split(/\r?\n/)
                          .forEach(function (line) {
                            var line = line.split(":"),
                              key = line.shift().trim();
                            key &&
                              ((line = line.join(":").trim()),
                              headers.append(key, line));
                          }),
                        headers),
                    },
                    body =
                      ((rawHeaders.url =
                        "responseURL" in xhr
                          ? xhr.responseURL
                          : rawHeaders.headers.get("X-Request-URL")),
                      "response" in xhr ? xhr.response : xhr.responseText);
                  resolve(new Response(body, rawHeaders));
                }),
                  (xhr.onerror = function () {
                    reject(new TypeError("Network request failed"));
                  }),
                  (xhr.ontimeout = function () {
                    reject(new TypeError("Network request failed"));
                  }),
                  (xhr.onabort = function () {
                    reject(new exports.DOMException("Aborted", "AbortError"));
                  }),
                  xhr.open(request.method, request.url, !0),
                  "include" === request.credentials
                    ? (xhr.withCredentials = !0)
                    : "omit" === request.credentials &&
                      (xhr.withCredentials = !1),
                  "responseType" in xhr &&
                    support_blob &&
                    (xhr.responseType = "blob"),
                  request.headers.forEach(function (value, name) {
                    xhr.setRequestHeader(name, value);
                  }),
                  request.signal &&
                    (request.signal.addEventListener("abort", abortXhr),
                    (xhr.onreadystatechange = function () {
                      4 === xhr.readyState &&
                        request.signal.removeEventListener("abort", abortXhr);
                    })),
                  xhr.send(
                    void 0 === request._bodyInit ? null : request._bodyInit
                  );
              });
            }
            (fetch.polyfill = !0),
              self.fetch ||
                ((self.fetch = fetch),
                (self.Headers = Headers),
                (self.Request = Request),
                (self.Response = Response)),
              (exports.Headers = Headers),
              (exports.Request = Request),
              (exports.Response = Response),
              (exports.fetch = fetch),
              Object.defineProperty(exports, "__esModule", { value: !0 });
          })({});
        })(__self__),
          (__self__.fetch.ponyfill = !0),
          delete __self__.fetch.polyfill;
        ((exports = __self__.fetch).default = __self__.fetch),
          (exports.fetch = __self__.fetch),
          (exports.Headers = __self__.Headers),
          (exports.Request = __self__.Request),
          (exports.Response = __self__.Response),
          (module.exports = exports);
      },
      {},
    ],
    31: [
      function (require, module, exports) {
        module.exports = !1;
      },
      {},
    ],
    32: [
      function (require, module, exports) {
        !function (global) {
          !function () {
            var __extends,
              __assign,
              __rest,
              __decorate,
              __param,
              __metadata,
              __awaiter,
              __generator,
              __exportStar,
              __values,
              __read,
              __spread,
              __spreadArrays,
              __await,
              __asyncGenerator,
              __asyncDelegator,
              __asyncValues,
              __makeTemplateObject,
              __importStar,
              __importDefault,
              __classPrivateFieldGet,
              __classPrivateFieldSet,
              __createBinding;
            !(function (factory) {
              var root =
                "object" == typeof global
                  ? global
                  : "object" == typeof self
                  ? self
                  : "object" == typeof this
                  ? this
                  : {};
              function createExporter(exports, previous) {
                return (
                  exports !== root &&
                    ("function" == typeof Object.create
                      ? Object.defineProperty(exports, "__esModule", {
                          value: !0,
                        })
                      : (exports.__esModule = !0)),
                  function (id, v) {
                    return (exports[id] = previous ? previous(id, v) : v);
                  }
                );
              }
              "function" == typeof define && define.amd
                ? define("tslib", ["exports"], function (exports) {
                    factory(createExporter(root, createExporter(exports)));
                  })
                : "object" == typeof module && "object" == typeof module.exports
                ? factory(createExporter(root, createExporter(module.exports)))
                : factory(createExporter(root));
            })(function (exporter) {
              var extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                  function (d, b) {
                    d.__proto__ = b;
                  }) ||
                function (d, b) {
                  for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
                };
              (__extends = function (d, b) {
                function __() {
                  this.constructor = d;
                }
                extendStatics(d, b),
                  (d.prototype =
                    null === b
                      ? Object.create(b)
                      : ((__.prototype = b.prototype), new __()));
              }),
                (__assign =
                  Object.assign ||
                  function (t) {
                    for (var s, i = 1, n = arguments.length; i < n; i++)
                      for (var p in (s = arguments[i]))
                        Object.prototype.hasOwnProperty.call(s, p) &&
                          (t[p] = s[p]);
                    return t;
                  }),
                (__rest = function (s, e) {
                  var t = {};
                  for (p in s)
                    Object.prototype.hasOwnProperty.call(s, p) &&
                      e.indexOf(p) < 0 &&
                      (t[p] = s[p]);
                  if (
                    null != s &&
                    "function" == typeof Object.getOwnPropertySymbols
                  )
                    for (
                      var i = 0, p = Object.getOwnPropertySymbols(s);
                      i < p.length;
                      i++
                    )
                      e.indexOf(p[i]) < 0 &&
                        Object.prototype.propertyIsEnumerable.call(s, p[i]) &&
                        (t[p[i]] = s[p[i]]);
                  return t;
                }),
                (__decorate = function (decorators, target, key, desc) {
                  var d,
                    c = arguments.length,
                    r =
                      c < 3
                        ? target
                        : null === desc
                        ? (desc = Object.getOwnPropertyDescriptor(target, key))
                        : desc;
                  if (
                    "object" == typeof Reflect &&
                    "function" == typeof Reflect.decorate
                  )
                    r = Reflect.decorate(decorators, target, key, desc);
                  else
                    for (var i = decorators.length - 1; 0 <= i; i--)
                      (d = decorators[i]) &&
                        (r =
                          (c < 3
                            ? d(r)
                            : 3 < c
                            ? d(target, key, r)
                            : d(target, key)) || r);
                  return 3 < c && r && Object.defineProperty(target, key, r), r;
                }),
                (__param = function (paramIndex, decorator) {
                  return function (target, key) {
                    decorator(target, key, paramIndex);
                  };
                }),
                (__metadata = function (metadataKey, metadataValue) {
                  if (
                    "object" == typeof Reflect &&
                    "function" == typeof Reflect.metadata
                  )
                    return Reflect.metadata(metadataKey, metadataValue);
                }),
                (__awaiter = function (thisArg, _arguments, P, generator) {
                  return new (P = P || Promise)(function (resolve, reject) {
                    function fulfilled(value) {
                      try {
                        step(generator.next(value));
                      } catch (e) {
                        reject(e);
                      }
                    }
                    function rejected(value) {
                      try {
                        step(generator.throw(value));
                      } catch (e) {
                        reject(e);
                      }
                    }
                    function step(result) {
                      var value;
                      result.done
                        ? resolve(result.value)
                        : ((value = result.value) instanceof P
                            ? value
                            : new P(function (resolve) {
                                resolve(value);
                              })
                          ).then(fulfilled, rejected);
                    }
                    step(
                      (generator = generator.apply(
                        thisArg,
                        _arguments || []
                      )).next()
                    );
                  });
                }),
                (__generator = function (thisArg, body) {
                  var f,
                    y,
                    t,
                    _ = {
                      label: 0,
                      sent: function () {
                        if (1 & t[0]) throw t[1];
                        return t[1];
                      },
                      trys: [],
                      ops: [],
                    },
                    g = { next: verb(0), throw: verb(1), return: verb(2) };
                  return (
                    "function" == typeof Symbol &&
                      (g[Symbol.iterator] = function () {
                        return this;
                      }),
                    g
                  );
                  function verb(n) {
                    return function (v) {
                      var op = [n, v];
                      if (f)
                        throw new TypeError("Generator is already executing.");
                      for (; _; )
                        try {
                          if (
                            ((f = 1),
                            y &&
                              (t =
                                2 & op[0]
                                  ? y.return
                                  : op[0]
                                  ? y.throw || ((t = y.return) && t.call(y), 0)
                                  : y.next) &&
                              !(t = t.call(y, op[1])).done)
                          )
                            return t;
                          switch (
                            ((y = 0), (op = t ? [2 & op[0], t.value] : op)[0])
                          ) {
                            case 0:
                            case 1:
                              t = op;
                              break;
                            case 4:
                              return _.label++, { value: op[1], done: !1 };
                            case 5:
                              _.label++, (y = op[1]), (op = [0]);
                              continue;
                            case 7:
                              (op = _.ops.pop()), _.trys.pop();
                              continue;
                            default:
                              if (
                                !(t =
                                  0 < (t = _.trys).length && t[t.length - 1]) &&
                                (6 === op[0] || 2 === op[0])
                              ) {
                                _ = 0;
                                continue;
                              }
                              if (
                                3 === op[0] &&
                                (!t || (op[1] > t[0] && op[1] < t[3]))
                              )
                                _.label = op[1];
                              else if (6 === op[0] && _.label < t[1])
                                (_.label = t[1]), (t = op);
                              else {
                                if (!(t && _.label < t[2])) {
                                  t[2] && _.ops.pop(), _.trys.pop();
                                  continue;
                                }
                                (_.label = t[2]), _.ops.push(op);
                              }
                          }
                          op = body.call(thisArg, _);
                        } catch (e) {
                          (op = [6, e]), (y = 0);
                        } finally {
                          f = t = 0;
                        }
                      if (5 & op[0]) throw op[1];
                      return { value: op[0] ? op[1] : void 0, done: !0 };
                    };
                  }
                }),
                (__createBinding = function (o, m, k, k2) {
                  o[(k2 = void 0 === k2 ? k : k2)] = m[k];
                }),
                (__exportStar = function (m, exports) {
                  for (var p in m)
                    "default" === p ||
                      exports.hasOwnProperty(p) ||
                      (exports[p] = m[p]);
                }),
                (__values = function (o) {
                  var s = "function" == typeof Symbol && Symbol.iterator,
                    m = s && o[s],
                    i = 0;
                  if (m) return m.call(o);
                  if (o && "number" == typeof o.length)
                    return {
                      next: function () {
                        return {
                          value:
                            (o = o && i >= o.length ? void 0 : o) && o[i++],
                          done: !o,
                        };
                      },
                    };
                  throw new TypeError(
                    s
                      ? "Object is not iterable."
                      : "Symbol.iterator is not defined."
                  );
                }),
                (__read = function (o, n) {
                  var m = "function" == typeof Symbol && o[Symbol.iterator];
                  if (!m) return o;
                  var r,
                    e,
                    i = m.call(o),
                    ar = [];
                  try {
                    for (; (void 0 === n || 0 < n--) && !(r = i.next()).done; )
                      ar.push(r.value);
                  } catch (error) {
                    e = { error: error };
                  } finally {
                    try {
                      r && !r.done && (m = i.return) && m.call(i);
                    } finally {
                      if (e) throw e.error;
                    }
                  }
                  return ar;
                }),
                (__spread = function () {
                  for (var ar = [], i = 0; i < arguments.length; i++)
                    ar = ar.concat(__read(arguments[i]));
                  return ar;
                }),
                (__spreadArrays = function () {
                  for (var s = 0, i = 0, il = arguments.length; i < il; i++)
                    s += arguments[i].length;
                  for (var r = Array(s), k = 0, i = 0; i < il; i++)
                    for (
                      var a = arguments[i], j = 0, jl = a.length;
                      j < jl;
                      j++, k++
                    )
                      r[k] = a[j];
                  return r;
                }),
                (__await = function (v) {
                  return this instanceof __await
                    ? ((this.v = v), this)
                    : new __await(v);
                }),
                (__asyncGenerator = function (thisArg, _arguments, generator) {
                  var g, q, i;
                  if (Symbol.asyncIterator)
                    return (
                      (g = generator.apply(thisArg, _arguments || [])),
                      (q = []),
                      (i = {}),
                      verb("next"),
                      verb("throw"),
                      verb("return"),
                      (i[Symbol.asyncIterator] = function () {
                        return this;
                      }),
                      i
                    );
                  throw new TypeError("Symbol.asyncIterator is not defined.");
                  function verb(n) {
                    g[n] &&
                      (i[n] = function (v) {
                        return new Promise(function (a, b) {
                          1 < q.push([n, v, a, b]) || resume(n, v);
                        });
                      });
                  }
                  function resume(n, v) {
                    try {
                      (r = g[n](v)).value instanceof __await
                        ? Promise.resolve(r.value.v).then(fulfill, reject)
                        : settle(q[0][2], r);
                    } catch (e) {
                      settle(q[0][3], e);
                    }
                    var r;
                  }
                  function fulfill(value) {
                    resume("next", value);
                  }
                  function reject(value) {
                    resume("throw", value);
                  }
                  function settle(f, v) {
                    f(v), q.shift(), q.length && resume(q[0][0], q[0][1]);
                  }
                }),
                (__asyncDelegator = function (o) {
                  var p,
                    i = {};
                  return (
                    verb("next"),
                    verb("throw", function (e) {
                      throw e;
                    }),
                    verb("return"),
                    (i[Symbol.iterator] = function () {
                      return this;
                    }),
                    i
                  );
                  function verb(n, f) {
                    i[n] = o[n]
                      ? function (v) {
                          return (p = !p)
                            ? { value: __await(o[n](v)), done: "return" === n }
                            : f
                            ? f(v)
                            : v;
                        }
                      : f;
                  }
                }),
                (__asyncValues = function (o) {
                  var m, i;
                  if (Symbol.asyncIterator)
                    return (m = o[Symbol.asyncIterator])
                      ? m.call(o)
                      : ((o = __values(o)),
                        (i = {}),
                        verb("next"),
                        verb("throw"),
                        verb("return"),
                        (i[Symbol.asyncIterator] = function () {
                          return this;
                        }),
                        i);
                  throw new TypeError("Symbol.asyncIterator is not defined.");
                  function verb(n) {
                    i[n] =
                      o[n] &&
                      function (v) {
                        return new Promise(function (resolve, reject) {
                          (function (resolve, reject, d, v) {
                            Promise.resolve(v).then(function (v) {
                              resolve({ value: v, done: d });
                            }, reject);
                          })(resolve, reject, (v = o[n](v)).done, v.value);
                        });
                      };
                  }
                }),
                (__makeTemplateObject = function (cooked, raw) {
                  return (
                    Object.defineProperty
                      ? Object.defineProperty(cooked, "raw", { value: raw })
                      : (cooked.raw = raw),
                    cooked
                  );
                }),
                (__importStar = function (mod) {
                  if (mod && mod.__esModule) return mod;
                  var result = {};
                  if (null != mod)
                    for (var k in mod)
                      Object.hasOwnProperty.call(mod, k) &&
                        (result[k] = mod[k]);
                  return (result.default = mod), result;
                }),
                (__importDefault = function (mod) {
                  return mod && mod.__esModule ? mod : { default: mod };
                }),
                (__classPrivateFieldGet = function (receiver, privateMap) {
                  if (privateMap.has(receiver)) return privateMap.get(receiver);
                  throw new TypeError(
                    "attempted to get private field on non-instance"
                  );
                }),
                (__classPrivateFieldSet = function (
                  receiver,
                  privateMap,
                  value
                ) {
                  if (privateMap.has(receiver))
                    return privateMap.set(receiver, value), value;
                  throw new TypeError(
                    "attempted to set private field on non-instance"
                  );
                }),
                exporter("__extends", __extends),
                exporter("__assign", __assign),
                exporter("__rest", __rest),
                exporter("__decorate", __decorate),
                exporter("__param", __param),
                exporter("__metadata", __metadata),
                exporter("__awaiter", __awaiter),
                exporter("__generator", __generator),
                exporter("__exportStar", __exportStar),
                exporter("__createBinding", __createBinding),
                exporter("__values", __values),
                exporter("__read", __read),
                exporter("__spread", __spread),
                exporter("__spreadArrays", __spreadArrays),
                exporter("__await", __await),
                exporter("__asyncGenerator", __asyncGenerator),
                exporter("__asyncDelegator", __asyncDelegator),
                exporter("__asyncValues", __asyncValues),
                exporter("__makeTemplateObject", __makeTemplateObject),
                exporter("__importStar", __importStar),
                exporter("__importDefault", __importDefault),
                exporter("__classPrivateFieldGet", __classPrivateFieldGet),
                exporter("__classPrivateFieldSet", __classPrivateFieldSet);
            });
          }.call(this);
        }.call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      {},
    ],
  },
  {},
  [1]
);
