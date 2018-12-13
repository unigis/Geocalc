const Geocalc = {
    earthRadius:6371393.0,//地球平均半径，单位m
    toRadian:function(dAngle){
        return dAngle * Math.PI /180;
    },
    toAngle:function(dRadian){
        return dRadian * 180 / Math.PI;
    },
    getPntRadian:function (pntStart, pntEnd) {
		//计算两个经纬度点的弧度（和正东方向的逆时针夹角）。
		var dX= pntEnd.lng - pntStart.lng, dY=pntEnd.lat - pntStart.lat, n = 0;
        return   (n = Math.atan2(dY, dX)) < 0 && (n += 2 * Math.PI), n
    },
    ptIsInPolygon:function (arryPnts, testPoint) {
        //地理围栏  - 多边形查询
        //arryPnts必须是[[一维]]数组点位，testPoint为要判断的点
        if (!arryPnts || null === arryPnts || 0 === arryPnts.length) return !1;
        for (var i = 0, o = arryPnts.length, n = 0; n < o; n++) {
            var s = arryPnts[n], a = arryPnts[(n + 1) % o];
            if (s.lat !== a.lat) {
                var l = s.lat < a.lat ? s.lat : a.lat, r = s.lat > a.lat ? s.lat : a.lat;
                testPoint.lat < l || testPoint.lat > r || (testPoint.lat - s.lat) * (a.lng - s.lng) / (a.lat - s.lat) + s.lng > testPoint.lng && i++
            }
        }
        return i % 2 == 1
    },
    geofencng: function (x, y, APoints) {
        //地理围栏
        //APoints必须是[[一维]]数组点位
        var iSum = 0,
            iCount;
        var dLon1, dLon2, dLat1, dLat2, dLon;
        if (APoints.length < 3) {
            return false;
        }
        iCount = APoints.length;
        for (var i = 0; i < iCount; i++) {
            if (i === iCount - 1) {
                dLon1 = APoints[i].lng;
                dLat1 = APoints[i].lat;
                dLon2 = APoints[0].lng;
                dLat2 = APoints[0].lat;
            } else {
                dLon1 = APoints[i].lng;
                dLat1 = APoints[i].lat;
                dLon2 = APoints[i + 1].lng;
                dLat2 = APoints[i + 1].lat;
            }
            //以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
            if (((y >= dLat1) && (y < dLat2)) || ((y >= dLat2) && (y < dLat1))) {
                if (Math.abs(dLat1 - dLat2) > 0) {
                    //得到 A点向左射线与边的交点的x坐标：
                    dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - y)) / (dLat1 - dLat2);
                    if (dLon < x)
                        iSum++;
                }
            }
        }
        return iSum % 2 == 1;
    },
    ptInBounds:function (point, bounds) {
        //点在矩形范围内
        return point.lng > bounds.left && point.lng < bounds.right && point.lat < bounds.top && point.lat > bounds.bottom
    },
    distance:function (pointA, pointB) {
        //计算两点直线距离
        return Math.sqrt((pointA.lng - pointB.lng) * (pointA.lng - pointB.lng) + (pointA.lat - pointB.lat) * (pointA.lat - pointB.lat))
    },
    getAntAzimPoint: function (lng, lat, dAzim, Dist) {
        //绘制方位曲线，lng经度，lat纬度，Azim 磁北方位角（顺时针方向）角度值，Dist为两点距离,单位为KM
        //返回计算得到的经纬度点位
        var rtnPoint = {};
        var txLatRad;
        var txLonRad;
        var rxLatRad;
        var azimRad;
        var Distrad;
        var X;
        var Y;
        var lon;

        txLatRad = (lat * Math.PI) / 180;
        txLonRad = (lng * Math.PI) / 180;
        azimRad = (dAzim * Math.PI) / 180;
        Distrad = ((Dist / 111.198) * Math.PI) / 180;

        Y = Math.cos(azimRad) * Math.cos(txLatRad) * Math.sin(Distrad) + Math.sin(txLatRad) * Math.cos(Distrad);
        rxLatRad = this.Arcsin(Y);
        rtnPoint.lat = rxLatRad * 180 / Math.PI;

        X = (Math.cos(Distrad) - Math.sin(txLatRad) * Math.sin(rxLatRad)) / (Math.cos(txLatRad) * Math.cos(rxLatRad));
        if (dAzim >= 180) {
            lon = lng - this.Arccos(X) * 180 / Math.PI;
            if (Math.abs(lon) > 180)
                lon = 0 - lon - 360;
        }
        else {
            lon = lng + this.Arccos(X) * 180 / Math.PI;
            if (Math.abs(lon) > 180)
                lon = lon - 360;
        }
        rtnPoint.lng = lon;
        return rtnPoint;
    },
    Arcsin: function (A) {
        return Math.atan(A / Math.sqrt(1 - A * A));
    },
    Arccos: function (A) {
        if (Math.abs(A - 1) < 0.0000000000001)
            return 0;
        else
            return Math.atan(0 - A / Math.sqrt(1 - A * A)) + 2 * Math.atan(1);
    }
}