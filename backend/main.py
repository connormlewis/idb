from app import app

if __name__ == "__main__":
    app = app.create_app()
    app.register_routes(app)
    app.run(host="0.0.0.0", debug=True, port=80)