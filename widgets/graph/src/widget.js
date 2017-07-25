/**
 * Created by jakubniezgoda on 15/03/2017.
 */

Stage.defineWidget({
    id: 'graph',
    name: 'Deployment metric graph',
    description: 'Display graph with deployment metric data',
    initialWidth: 6,
    initialHeight: 20,
    showHeader: true,
    showBorder: true,
    isReact: true,
    color: "blue",
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        {id: "deploymentId", name: "Deployment ID", placeHolder: "If not set, then will be taken from context", default: "", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "from", name: "Time range start", placeHolder: "Start time for data to be presented", default: "now() - 15m", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name:'last 15 minutes', value:'now() - 15m'}, {name:'last hour', value:'now() - 1h'}, {name:'last day', value: 'now() - 1d'}]},
        {id: "to", name: "Time range end", placeHolder: "End time for data to be presented", default: "now()", type: Stage.Basic.GenericField.LIST_TYPE,
         items: [{name:'now', value:'now()'}]},
        {id: "resolution", name: "Time resolution value",  placeHolder: "Time resolution value", default: "1", type: Stage.Basic.GenericField.NUMBER_TYPE,
         min: Stage.Common.TimeConsts.MIN_TIME_RESOLUTION_VALUE, max: Stage.Common.TimeConsts.MAX_TIME_RESOLUTION_VALUE},
        {id: "unit", name: "Time resolution unit", placeHolder: "Time resolution unit", default: "m", type: Stage.Basic.GenericField.LIST_TYPE,
            items: Stage.Common.TimeConsts.TIME_RESOLUTION_UNITS},
        {id: "type", name: "Charts type", items: [{name:'Line chart', value:Stage.Basic.Graphs.Graph.LINE_CHART_TYPE}, {name:'Bar chart', value:Stage.Basic.Graphs.Graph.BAR_CHART_TYPE}],
         default: Stage.Basic.Graphs.Graph.LINE_CHART_TYPE, type: Stage.Basic.GenericField.LIST_TYPE},
        {id: "charts", name: "Charts table",  description: "", default: "", type: Stage.Basic.GenericField.EDITABLE_TABLE_TYPE, max: 5, items: [
            {name: "metric", label: 'Metric', default: "", type: Stage.Basic.GenericField.EDITABLE_LIST_TYPE, description: "Metric data to be presented on the graph",
             items: ["", "cpu_total_system", "cpu_total_user", "memory_MemFree", "memory_SwapFree", "loadavg_processes_running"]},
            // TODO: Add query column
            // {name: 'query', label: 'Query', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "InfluxQL query to fetch input data for the graph"},
            {name: 'label', label: 'Label', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "Data label to be shown below the graph"},
            {name: 'unit', label: 'Unit', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "Data unit to be shown on the left side of the graph"}
            ]
        }
    ],

    _prepareData: function(data, xDataKey) {
        const TIME_FORMAT = "HH:mm:ss";
        const MAX_NUMBER_OF_POINTS = 500;
        const NUMBER_OF_METRICS = data.length;
        const NUMBER_OF_POINTS = data[0].points.length;
        let points = [];

        // Data conversion to recharts format
        for (let i = 0; i < NUMBER_OF_POINTS; i++) {
            let point = { [xDataKey]: Stage.Utils.formatTimestamp(data[0].points[i][0], TIME_FORMAT, null) };
            for (let j = 0; j < NUMBER_OF_METRICS; j++) {
                let metricName = data[j].name;
                let pointValue = data[j].points[i][1];
                point[metricName] = pointValue;
            }
            points.push(point);
        }

        // Data optimization (show no more than MAX_NUMBER_OF_POINTS points on the graph)
        if (points.length > MAX_NUMBER_OF_POINTS) {
            let optimizedPoints = [];
            let delta = parseFloat(points.length / MAX_NUMBER_OF_POINTS);
            for (let i = 0; i < points.length; i = i + delta) {
                optimizedPoints.push(points[Math.floor(i)]);
            }
            points = optimizedPoints;
        }

        return points;
    },

    _getChartsList: function(charts) {
        return _.map(_.filter(charts, (graph) => !_.isEmpty(graph.metric)), (graph) => graph.metric);
    },

    _getChartsConfiguration: function(charts) {
        let chartsConfig = [];

        _.forEach(charts, (chart) => {
            // TODO: Handle query-based charts
            let metricName = chart.metric;
            if (!_.isEmpty(metricName)) {
                chartsConfig.push({
                    name: metricName,
                    label: chart.label,
                    unit: chart.unit
                });
            }
        })

        return chartsConfig;
    },

    fetchParams: function(widget, toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;

        let timeFilter = toolbox.getContext().getValue('timeFilter') || {};

        let timeStart = timeFilter.start;
        timeStart = timeStart ? `${moment(timeStart).unix()}s` : widget.configuration.from;

        let timeEnd = timeFilter.end;
        timeEnd = timeEnd ? `${moment(timeEnd).unix()}s` : widget.configuration.to;

        let timeResolutionValue = timeFilter.resolution;
        let timeResolutionUnit = timeFilter.unit;
        let timeGroup = timeResolutionValue && timeResolutionUnit
            ? `${timeResolutionValue}${timeResolutionUnit}`
            : `${widget.configuration.resolution}${widget.configuration.unit}`;

        return { deploymentId, timeStart, timeEnd, timeGroup };
    },

    fetchData: function(widget, toolbox, params) {
        let actions = new Stage.Common.InfluxActions(toolbox);
        let deploymentId = params.deploymentId;
        let metrics = this._getChartsList(widget.configuration.charts);

        // TODO: Add query-based data fetching
        if (!_.isEmpty(deploymentId) && !_.isEmpty(metrics)) {
            let from = params.timeStart;
            let to = params.timeEnd;
            let timeGroup = params.timeGroup;
            return actions.doGetMetric(deploymentId, metrics, from, to, timeGroup).then((data) => {
                let formattedResponse
                    = _.map(data, (metric) => ({name: _.last(_.split(metric.name, '.')), points: metric.points}));
                return Promise.resolve(formattedResponse);
            });
        } else {
            return Promise.resolve([]);
        }
    },

    render: function(widget,data,error,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;
        let metrics = this._getChartsList(widget.configuration.charts);

        if (_.isEmpty(deploymentId) || _.isEmpty(metrics)) {
            let {Message, Icon} = Stage.Basic;
            return (
                <Message>
                    <Icon name="ban" />
                    <span>Widget not configured properly. Please configure at least one chart and provide Deployment ID.</span>
                </Message>
            );
        }

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let {Graph} = Stage.Basic.Graphs;
        let type = widget.configuration.type;
        let charts = this._getChartsConfiguration(widget.configuration.charts);
        let preparedData = this._prepareData(data, Graph.DEFAULT_X_DATA_KEY);

        return (
            <Graph data={preparedData} charts={charts} type={type} />
        );

    }
});