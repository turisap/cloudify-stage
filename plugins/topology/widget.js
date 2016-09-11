/**
 * Created by kinneretzin on 07/09/2016.
 */


export default class BlueprintsWidget {
    render() {
        return (
            <table className="ui very compact table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th># Deployments</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Blueprint1</td>
                    <td>2d ago</td>
                    <td>2d ago</td>
                    <td><div className="ui green horizontal label">4</div></td>
                </tr>
                <tr>
                    <td>nodecellar</td>
                    <td>2h ago</td>
                    <td>2h ago</td>
                    <td><div className="ui green horizontal label">4</div></td>
                </tr>
                <tr>
                    <td>winpoc</td>
                    <td>yesterday</td>
                    <td>yesterday</td>
                    <td><div className="ui green horizontal label">4</div></td>
                </tr>
                <tr>
                    <td>blueprint-2</td>
                    <td>2 weeks ago</td>
                    <td>2 weeks ago</td>
                    <td><div className="ui green horizontal label">4</div></td>
                </tr>
                <tr>
                    <td>nodecellar-simple</td>
                    <td>yesterday</td>
                    <td>yesterda</td>
                    <td><div className="ui green horizontal label">4</div></td>
                </tr>
                <tr>
                    <td>aws-example</td>
                    <td>1h ago</td>
                    <td>1h ago</td>
                    <td><div className="ui green horizontal label">4</div></td>
                </tr>
                <tr>
                    <td>my blueprint</td>
                    <td>2h ago</td>
                    <td>1h ago</td>
                    <td><div className="ui green horizontal label">4</div></td>
                </tr>
                <tr>
                    <td>bp222</td>
                    <td>3h ago</td>
                    <td>2m ago</td>
                    <td><div className="ui green horizontal label">4</div></td>
                </tr>
                </tbody>
            </table>
        );

    }
}