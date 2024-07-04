import nunjucks from 'nunjucks'

export function alertDangerExtention(){
    this.tags = ['AlertDanger'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endAlertDanger');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);
    };
    
    this.run = function(context, key, body) {
            try{
                const msg = context?.ctx?.settings?.req?.query?.msg ?? '';
                
                if(msg === key){
                    const html = ` <div class="text-center alert alert-danger">${body()}</div>`;
                    return new nunjucks.runtime.markSafe(html);
                }
            
            }catch(e){
                return e.toString()
            }
        };

}



export function alertSuccessExtention(){
    this.tags = ['AlertSuccess'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        var body = parser.parseUntilBlocks('endAlertSuccess');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);
    };
    
    this.run = function(context, key, body) {
            try{
                const msg = context?.ctx?.settings?.req?.query?.msg ?? '';
                
                if(msg === key){
                    const html = ` <div class="text-center alert alert-success">${body()}</div>`;
                    return new nunjucks.runtime.markSafe(html);
                }
            
            }catch(e){
                return e.toString()
            }
        };

}


/*
function RemoteExtension() {
    this.tags = ['remote'];

    this.parse = function(parser, nodes, lexer) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('error', 'endremote');
        var errorBody = null;

        if(parser.skipSymbol('error')) {
            parser.skip(lexer.TOKEN_BLOCK_END);
            errorBody = parser.parseUntilBlocks('endremote');
        }

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'run', args, [body, errorBody]);
    };

    this.run = function(context, url, body, errorBody) {
        var id = 'el' + Math.floor(Math.random() * 10000);
        var ret = new nunjucks.runtime.SafeString('<div id="' + id + '">' + body() + '</div>');
        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function() {
            if(ajax.readyState == 4) {
                if(ajax.status == 200) {
                    document.getElementById(id).innerHTML = ajax.responseText;
                }
                else {
                    document.getElementById(id).innerHTML = errorBody();
                }
            }
        };

        ajax.open('GET', url, true);
        ajax.send();

        return ret;
    };
}

env.addExtension('RemoteExtension', new RemoteExtension());
*/
