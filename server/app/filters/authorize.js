var User = Risotto.models.user;

Risotto.before('authorize', function*(){
	if( !this.session.authorized ){
		this.koaContext.status = 403;
		throw new Error('Not authorized');
	}
});