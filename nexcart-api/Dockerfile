
FROM eclipse-temurin:24-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:24-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/images ./images


EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xss512k -XX:MaxRAMPercentage=50.0 -Xmx220m -Dserver.port=${PORT:-8080} -jar app.jar"]
