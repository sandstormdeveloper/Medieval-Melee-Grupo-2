package com.example.medieval_melee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class MedievalMeleeApplication implements WebSocketConfigurer {

	private final GameWebSocketHandler gameWebSocketHandler;

	public MedievalMeleeApplication(GameWebSocketHandler gameWebSocketHandler) {
		this.gameWebSocketHandler = gameWebSocketHandler;
	}

	public static void main(String[] args) {
		SpringApplication.run(MedievalMeleeApplication.class, args);
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(gameWebSocketHandler, "/ws")
				.setAllowedOrigins("*"); // Configure appropriate CORS in production
	}

	@Bean
	public GameWebSocketHandler getGameWebSocketHandler() {
		return new GameWebSocketHandler();
	}
}
