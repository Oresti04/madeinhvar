(()=>{var e={};e.id=433,e.ids=[433],e.modules={399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9348:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},412:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3424:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>m,routeModule:()=>u,serverHooks:()=>l,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>c});var o={};t.r(o),t.d(o,{POST:()=>p});var s=t(2412),i=t(4293),n=t(4147),a=t(7856);async function p(e){if(!process.env.RESEND_API_KEY)return a.NextResponse.json({error:"Missing Resend API key"},{status:500});let r=process.env.RESEND_FROM_EMAIL||"orders@yourdomain.com",t=process.env.RESEND_NOTIFY_EMAIL||"owner@yourdomain.com",{email:o,name:s,orderId:i,items:n,total:p,shipping:u,customerMessage:d}=await e.json(),c=`
    <html>
      <body style="font-family: Arial, sans-serif; background:#F7F3EF; color:#222; padding:24px;">
        <h1>Order Confirmation</h1>
        <p>Thank you, ${s}.</p>
        <p>Your order <strong>${i}</strong> is confirmed.</p>
        <ul>
          ${n.map(e=>`<li>${e.quantity}\xd7 ${e.title} — €${(e.price/100).toFixed(2)}</li>`).join("")}
        </ul>
        <p>Total: €${(p/100).toFixed(2)}</p>
        <p>Shipping method: ${u}</p>
        <p>${d||""}</p>
      </body>
    </html>
  `;return await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.RESEND_API_KEY}`},body:JSON.stringify({from:r,to:[o,t],subject:`Your Made in Hvar order ${i}`,html:c})}),a.NextResponse.json({success:!0})}let u=new s.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/email/route",pathname:"/api/email",filename:"route",bundlePath:"app/api/email/route"},resolvedPagePath:"/Users/orestkisi/Desktop/madeinhvar/app/api/email/route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:d,workUnitAsyncStorage:c,serverHooks:l}=u;function m(){return(0,n.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:c})}},5303:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[147,814],()=>t(3424));module.exports=o})();