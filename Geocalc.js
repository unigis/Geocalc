const Geocalc = {
    toRadian:function(dAngle){
        return dAngle * Math.PI /180;
    },
    toAngle:function(dRadian){
        return dRadian * 180 / Math.PI;
    },
    getPntRadian:function (pntStart, pntEnd) {
		//计算两个经纬度点的弧度（和正东方向的逆时针夹角）。
		var i, o, n = 0;
		i = pntEnd.lng - pntStart.lng, o = pntEnd.lat - pntStart.lat;
        return   (n = Math.atan2(o, i)) < 0 && (n += 2 * Math.PI), n
    }
}